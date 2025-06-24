import { db } from "@/db";
import { ingredientAliases } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { asc, sql } from "drizzle-orm";
import { z } from "zod";

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
});
