import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/contstants";
import { db } from "@/db";
import { recipes } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { endOfMonth, startOfMonth } from "date-fns";
import { and, eq, gte, lte } from "drizzle-orm";
import { z } from "zod/v4";

export const accountRouter = createTRPCRouter({
  getRecipesStats: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    const recipesCount = await db.$count(
      recipes,
      eq(recipes.authorId, user.id)
    );

    const notPublishedCount = await db.$count(
      recipes,
      and(eq(recipes.authorId, user.id), eq(recipes.published, false))
    );

    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    const recipesThisMonth = await db.$count(
      recipes,
      and(
        eq(recipes.authorId, user.id),
        gte(recipes.createdAt, startOfCurrentMonth),
        lte(recipes.createdAt, endOfCurrentMonth)
      )
    );

    return {
      recipesCount,
      notPublishedCount,
      recipesThisMonth,
      likes: 43,
      likesThisMonth: 12,
      comments: 12,
      commentsThisMonth: 3,
    };
  }),

  getUserRecipes: protectedProcedure
    .input(
      z.object({
        cursor: z.number().default(DEFAULT_PAGE),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const { cursor } = input;

      const data = await db.query.recipes.findMany({
        where: eq(recipes.authorId, user.id),
        limit: DEFAULT_PAGE_SIZE + 1,
        offset: (cursor - 1) * DEFAULT_PAGE_SIZE,
        with: {
          category: true,
          attributes: {
            with: {
              attribute: {
                columns: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      });

      const hasMore = data.length > DEFAULT_PAGE_SIZE;

      const items = hasMore ? data.slice(0, -1) : data;

      return {
        items,
        cursor,
        hasMore,
      };
    }),
});
