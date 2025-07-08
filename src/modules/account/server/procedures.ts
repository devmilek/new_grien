import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/contstants";
import { db } from "@/db";
import { recipes, userFollowers } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
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
          file: true,
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

  getFollowStats: baseProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { user: currentUser } = ctx;
      const { userId } = input;

      const [followingRecord, followersCount, followingCount] =
        await Promise.all([
          currentUser
            ? db.query.userFollowers.findFirst({
                where: and(
                  eq(userFollowers.followerId, currentUser.id),
                  eq(userFollowers.followingId, userId)
                ),
              })
            : Promise.resolve(null),
          db.$count(userFollowers, eq(userFollowers.followingId, userId)),
          db.$count(userFollowers, eq(userFollowers.followerId, userId)),
        ]);

      return {
        isFollowing: !!followingRecord,
        followersCount,
        followingCount,
      };
    }),

  followUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user: currentUser } = ctx;
      const { userId } = input;

      // Sprawdzamy, czy już istnieje
      const existing = await db
        .select()
        .from(userFollowers)
        .where(
          and(
            eq(userFollowers.followerId, currentUser.id),
            eq(userFollowers.followingId, userId)
          )
        );

      if (existing.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Już obserwujesz tego użytkownika.",
        });
      }

      await db.insert(userFollowers).values({
        followerId: currentUser.id,
        followingId: input.userId,
      });

      return { success: true };
    }),

  unfollowUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user: currentUser } = ctx;
      const { userId } = input;

      const existing = await db.query.userFollowers.findFirst({
        where: and(
          eq(userFollowers.followerId, currentUser.id),
          eq(userFollowers.followingId, userId)
        ),
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Nie obserwujesz tego użytkownika.",
        });
      }
      await db
        .delete(userFollowers)
        .where(
          and(
            eq(userFollowers.followerId, currentUser.id),
            eq(userFollowers.followingId, userId)
          )
        );
      return { success: true };
    }),

  deleteRecipe: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;

      const recipe = await db.query.recipes.findFirst({
        where: and(eq(recipes.id, id), eq(recipes.authorId, user.id)),
      });

      if (!recipe) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Nie znaleziono przepisu lub nie masz uprawnień do jego usunięcia.",
        });
      }

      await db.delete(recipes).where(eq(recipes.id, id));
    }),
});
