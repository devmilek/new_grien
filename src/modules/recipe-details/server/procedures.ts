import { db } from "@/db";
import { recipeLikes, recipes } from "@/db/schema";
import { mutationLimiter, viewLimiter } from "@/lib/rate-limiters";
import {
  baseProcedure,
  createRateLimitMiddleware,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod/v4";

export const recipeDetailsRouter = createTRPCRouter({
  getRecipe: baseProcedure
    .use(createRateLimitMiddleware(viewLimiter))
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const recipeId = input;
      const { user } = ctx;

      const recipe = await db.query.recipes.findFirst({
        where: and(eq(recipes.id, recipeId)),
        with: {
          author: true,
          file: true,
          license: true,
          category: {
            columns: {
              id: true,
              name: true,
            },
          },
          preparationSteps: true,
          ingredients: {
            with: {
              ingredientAlias: {
                columns: {
                  alias: true,
                  id: true,
                },
              },
            },
          },
          attributes: {
            with: {
              attribute: {
                columns: {
                  id: true,
                  name: true,
                  slug: true,
                  type: true,
                },
              },
            },
          },
        },
      });

      if (!recipe) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Nie znaleziono przepisu.",
        });
      }

      if (!recipe.published && recipe.authorId !== user?.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Nie masz uprawnień do przeglądania tego przepisu.",
        });
      }

      return recipe;
    }),
  toggleLike: protectedProcedure
    .use(createRateLimitMiddleware(mutationLimiter))
    .input(z.object({ recipeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { recipeId } = input;

      const existing = await db.query.recipeLikes.findFirst({
        where: and(
          eq(recipeLikes.userId, user.id),
          eq(recipeLikes.recipeId, recipeId)
        ),
      });

      if (existing) {
        await db
          .delete(recipeLikes)
          .where(
            and(
              eq(recipeLikes.userId, user.id),
              eq(recipeLikes.recipeId, recipeId)
            )
          );
        return { liked: false };
      } else {
        await db.insert(recipeLikes).values({
          userId: user.id,
          recipeId: input.recipeId,
        });
        return { liked: true };
      }
    }),
  getLikesMeta: baseProcedure
    .use(createRateLimitMiddleware(viewLimiter))
    .input(z.object({ recipeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx;

      try {
        const [countResult, userLike] = await Promise.all([
          db.$count(recipeLikes, eq(recipeLikes.recipeId, input.recipeId)),
          user
            ? db.query.recipeLikes.findFirst({
                where: and(
                  eq(recipeLikes.userId, user.id),
                  eq(recipeLikes.recipeId, input.recipeId)
                ),
              })
            : Promise.resolve(null),
        ]);

        console.log(`Likes count for recipe ${input.recipeId}: ${countResult}`);

        return {
          total: countResult,
          liked: !!userLike,
        };
      } catch (e) {
        console.error(
          `Error fetching likes meta for recipe ${input.recipeId}:`,
          e
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Wystąpił błąd podczas pobierania informacji o polubieniach.",
        });
      }
    }),
});
