import { db } from "@/db";
import { recipes } from "@/db/schema";
import { viewLimiter } from "@/lib/rate-limiters";
import {
  baseProcedure,
  createRateLimitMiddleware,
  createTRPCRouter,
} from "@/trpc/init";
import { and, eq, ilike } from "drizzle-orm";
import { z } from "zod";

export const homeRouter = createTRPCRouter({
  searchRecipes: baseProcedure
    .use(createRateLimitMiddleware(viewLimiter))
    .input(z.string())
    .query(async ({ input }) => {
      const query = input.trim().toLowerCase();
      const data = await db.query.recipes.findMany({
        where: and(
          eq(recipes.published, true),
          ilike(recipes.title, `%${query}%`)
        ),
        columns: {
          title: true,
          id: true,
        },
        with: {
          file: true,
        },
        limit: 6,
      });

      return data;
    }),
});
