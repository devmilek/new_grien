import { db } from "@/db";
import {
  files,
  ingredientAliases,
  InsertPreparationStep,
  InsertRecipeAttribute,
  InsertRecipeIngredient,
  preparationSteps,
  recipeAttributes,
  recipeIngredients,
  recipes,
} from "@/db/schema";
import {
  baseProcedure,
  createRateLimitMiddleware,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { and, asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createRecipeSchemaServer, editRecipeSchemaServer } from "../schemas";
import { TRPCError } from "@trpc/server";
import { s3 } from "@/lib/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { mutationLimiter, viewLimiter } from "@/lib/rate-limiters";

export const createRecipeRouter = createTRPCRouter({
  searchIngredients: baseProcedure
    .use(createRateLimitMiddleware(viewLimiter))
    .input(
      z.object({
        query: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { query } = input;
      const data = await db
        .select()
        .from(ingredientAliases)
        .where(
          query
            ? sql`unaccent(lower(${
                ingredientAliases.alias
              })) ILIKE unaccent(lower(${`%${query}%`}))`
            : undefined
        )
        .orderBy(asc(ingredientAliases.alias))
        .limit(10);

      console.log("Search ingredients query:", data);

      return data;
    }),
  createRecipe: protectedProcedure
    .use(createRateLimitMiddleware(mutationLimiter))
    .input(createRecipeSchemaServer)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      try {
        const recipe = await db.transaction(async (tx) => {
          const [recipe] = await tx
            .insert(recipes)
            .values({
              title: input.title,
              description: input.description,
              categoryId: input.categoryId,
              difficulty: input.difficulty,
              portions: input.portions,
              preparationTime: input.preparationTime,
              fileId: input.imageId,
              authorId: user.id,
              published: input.published,
            })
            .returning();

          const ingredients: InsertRecipeIngredient[] = input.ingredients.map(
            (ingredient) => ({
              recipeId: recipe.id,
              ingredientAlliasId: ingredient.ingredient.id,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
            })
          );

          if (ingredients.length > 0) {
            await tx.insert(recipeIngredients).values(ingredients);
          }

          const steps: InsertPreparationStep[] = input.steps.map(
            (step, index) => ({
              recipeId: recipe.id,
              stepNumber: index + 1,
              description: step.description,
              fileId: step.image ? step.image : null,
            })
          );

          if (steps.length > 0) {
            await tx.insert(preparationSteps).values(steps);
          }

          const attributes: InsertRecipeAttribute[] = input.attributes.map(
            (attributeId) => ({
              attributeId: attributeId,
              recipeId: recipe.id,
            })
          );

          if (attributes.length > 0) {
            await tx.insert(recipeAttributes).values(attributes);
          }

          return recipe;
        });

        // Return the created recipe or a success message
        return { recipeId: recipe.id };
      } catch (error) {
        console.error("Error creating recipe:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Nie udało się utworzyć przepisu. Spróbuj ponownie.",
        });
      }
    }),

  editRecipe: protectedProcedure
    .use(createRateLimitMiddleware(mutationLimiter))
    .input(editRecipeSchemaServer)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      try {
        const recipe = await db.transaction(async (tx) => {
          const existingRecipe = await tx.query.recipes.findFirst({
            where: and(eq(recipes.id, input.id), eq(recipes.authorId, user.id)),
          });

          if (!existingRecipe) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Przepis nie został znaleziony.",
            });
          }

          const newImage = existingRecipe.fileId !== input.imageId;

          const updatedRecipe = await tx
            .update(recipes)
            .set({
              title: input.title,
              description: input.description,
              categoryId: input.categoryId,
              difficulty: input.difficulty,
              portions: input.portions,
              preparationTime: input.preparationTime,
              fileId: newImage ? input.imageId : existingRecipe.fileId,
              published: input.published,
            })
            .where(eq(recipes.id, input.id))
            .returning();

          // Update ingredients
          await tx
            .delete(recipeIngredients)
            .where(eq(recipeIngredients.recipeId, input.id));
          const ingredients: InsertRecipeIngredient[] = input.ingredients.map(
            (ingredient) => ({
              recipeId: updatedRecipe[0].id,
              ingredientAlliasId: ingredient.ingredient.id,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
            })
          );
          if (ingredients.length > 0) {
            await tx.insert(recipeIngredients).values(ingredients);
          }

          // Update preparation steps
          await tx
            .delete(preparationSteps)
            .where(eq(preparationSteps.recipeId, input.id));
          const steps: InsertPreparationStep[] = input.steps.map(
            (step, index) => ({
              recipeId: updatedRecipe[0].id,
              stepNumber: index + 1,
              description: step.description,
              fileId: step.image ? step.image : null,
            })
          );
          if (steps.length > 0) {
            await tx.insert(preparationSteps).values(steps);
          }

          // Update attributes
          await tx
            .delete(recipeAttributes)
            .where(eq(recipeAttributes.recipeId, input.id));
          const attributes: InsertRecipeAttribute[] = input.attributes.map(
            (attributeId) => ({
              attributeId: attributeId,
              recipeId: updatedRecipe[0].id,
            })
          );

          if (attributes.length > 0) {
            await tx.insert(recipeAttributes).values(attributes);
          }

          if (newImage) {
            // remove old image if it exists
            console.log("there is a new image, removing old one");
            if (existingRecipe.fileId) {
              console.log("checking for existing file in DB");
              const dbFile = await tx.query.files.findFirst({
                where: eq(files.id, existingRecipe.fileId),
              });

              if (dbFile) {
                console.log("deleting file from S3 and DB");
                await s3.send(
                  new DeleteObjectCommand({
                    Bucket: process.env.R2_BUCKET_NAME!,
                    Key: dbFile.key,
                  })
                );

                console.log("deleting file from DB with id:", dbFile.id);

                await tx.delete(files).where(eq(files.id, dbFile.id));
              }
            }
          }

          return updatedRecipe[0];
        });

        return { recipeId: recipe.id };
      } catch (error) {
        console.error("Error editing recipe:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Nie udało się edytować przepisu. Spróbuj ponownie.",
        });
      }
    }),

  getRecipe: protectedProcedure
    .use(createRateLimitMiddleware(viewLimiter))
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const { id } = input;
      const { user } = ctx;

      const recipe = await db.query.recipes.findFirst({
        where: and(eq(recipes.id, id), eq(recipes.authorId, user.id)),
        with: {
          ingredients: {
            with: {
              ingredientAlias: true,
            },
          },
          category: true,
          attributes: true,
          preparationSteps: true,
          file: true,
        },
      });

      return recipe;
    }),
});
