import {
  baseProcedure,
  createRateLimitMiddleware,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { z } from "zod/v4";
import { commentSchema } from "../schemas";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/contstants";
import { mutationLimiter, viewLimiter } from "@/lib/rate-limiters";

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .use(createRateLimitMiddleware(mutationLimiter))
    .input(
      commentSchema.extend({
        recipeId: z.string().min(1, "ID przepisu jest wymagane"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { recipeId, content } = input;
      const { user } = ctx;

      try {
        const [comment] = await db
          .insert(comments)
          .values({
            content,
            recipeId,
            userId: user.id,
          })
          .returning();

        return comment;
      } catch (e) {
        console.error("Error creating comment:", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Nie udało się dodać komentarza. Spróbuj ponownie później.",
        });
      }
    }),
  getComments: baseProcedure
    .use(createRateLimitMiddleware(viewLimiter))
    .input(
      z.object({
        recipeId: z.string().min(1, "ID przepisu jest wymagane"),
        cursor: z.number().default(DEFAULT_PAGE),
      })
    )
    .query(async ({ input }) => {
      const { recipeId, cursor } = input;

      try {
        const data = await db.query.comments.findMany({
          where: eq(comments.recipeId, recipeId),
          with: {
            user: true,
          },
          limit: DEFAULT_PAGE_SIZE + 1,
          offset: (cursor - 1) * DEFAULT_PAGE_SIZE,
        });

        const hasMore = data.length > DEFAULT_PAGE_SIZE;

        const items = hasMore ? data.slice(0, -1) : data;

        return {
          items,
          cursor,
          hasMore,
        };
      } catch (e) {
        console.error("Error fetching comments:", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Nie udało się pobrać komentarzy. Spróbuj ponownie później.",
        });
      }
    }),

  delete: protectedProcedure
    .use(createRateLimitMiddleware(mutationLimiter))
    .input(
      z.object({
        commentId: z.string().min(1, "ID komentarza jest wymagane"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { commentId } = input;
      const { user } = ctx;

      try {
        const comment = await db.query.comments.findFirst({
          where: eq(comments.id, commentId),
        });

        if (!comment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Komentarz nie został znaleziony.",
          });
        }

        if (comment.userId !== user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Nie masz uprawnień do usunięcia tego komentarza.",
          });
        }

        await db.delete(comments).where(eq(comments.id, commentId));
      } catch (e) {
        console.error("Error deleting comment:", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Nie udało się usunąć komentarza. Spróbuj ponownie później.",
        });
      }
    }),
});
