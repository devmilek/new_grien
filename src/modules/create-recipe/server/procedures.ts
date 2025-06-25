import { db } from "@/db";
import {
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
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { and, asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createRecipeSchemaServer } from "../schemas";
import { TRPCError } from "@trpc/server";

export const createRecipeRouter = createTRPCRouter({
  searchIngredients: baseProcedure
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

  getRecipe: protectedProcedure
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
