import {
  baseProcedure,
  createRateLimitMiddleware,
  createTRPCRouter,
} from "@/trpc/init";
import { z } from "zod/v4";
import { sortBy } from "../hooks/use-recipes-filters";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/contstants";
import { db } from "@/db";
import { and, eq, inArray, exists } from "drizzle-orm";
import {
  attributes as dbAttributes,
  categories,
  Category,
  recipes,
  recipeAttributes,
  Attribute,
} from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { viewLimiter } from "@/lib/rate-limiters";

export const recipesFilteringRouter = createTRPCRouter({
  getRecipes: baseProcedure
    .use(createRateLimitMiddleware(viewLimiter))
    .input(
      z.object({
        categorySlug: z.string().optional(),
        sortBy: z.enum(sortBy).default("newest").optional(), // Fixed typo: soryBy -> sortBy
        attributesSlugs: z.array(z.string()).optional(),
        cursor: z.number().default(DEFAULT_PAGE),
        authorId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { categorySlug, sortBy, cursor, attributesSlugs, authorId } = input;

      let category: Category | undefined;

      try {
        if (categorySlug) {
          category = await db.query.categories.findFirst({
            where: eq(categories.slug, categorySlug),
          });

          if (!category) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `Kategoria o slug ${categorySlug} nie została znaleziona.`,
            });
          }
        }

        let attributes: Attribute[] | undefined;

        if (attributesSlugs && attributesSlugs.length > 0) {
          attributes = await db.query.attributes.findMany({
            where: inArray(dbAttributes.slug, attributesSlugs),
          });

          if (attributes.length === 0) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `Atrybuty ${attributesSlugs.join(
                ", "
              )} nie zostały znalezione.`,
            });
          }
        }

        const data = await db.query.recipes.findMany({
          where: and(
            eq(recipes.published, true),
            category ? eq(recipes.categoryId, category.id) : undefined,
            authorId ? eq(recipes.authorId, authorId) : undefined,
            // Fixed: Use exists() to check for attributes in junction table
            attributes && attributes.length > 0
              ? exists(
                  db
                    .select()
                    .from(recipeAttributes)
                    .where(
                      and(
                        eq(recipeAttributes.recipeId, recipes.id),
                        inArray(
                          recipeAttributes.attributeId,
                          attributes.map((attr) => attr.id)
                        )
                      )
                    )
                )
              : undefined
          ),
          with: {
            category: true,
            license: true,
            attributes: {
              with: {
                attribute: true,
              },
            },
            file: true,
            author: true,
          },
          limit: DEFAULT_PAGE_SIZE + 1,
          offset: (cursor - 1) * DEFAULT_PAGE_SIZE,
          // Add ordering based on sortBy
          orderBy: (recipes, { desc, asc }) => {
            switch (sortBy) {
              case "newest":
                return desc(recipes.createdAt);
              case "fastest":
                return asc(recipes.preparationTime);
              case "popular":
                // You might want to add a popularity field or use a different metric
                return desc(recipes.createdAt);
              default:
                return desc(recipes.createdAt);
            }
          },
        });

        const hasMore = data.length > DEFAULT_PAGE_SIZE;
        const items = hasMore ? data.slice(0, -1) : data;

        console.log(`Fetched ${items.length} recipes from the database.`);

        return {
          items,
          cursor,
          hasMore,
        };
      } catch (error) {
        console.error("Error fetching recipes:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Wystąpił błąd podczas pobierania przepisów.",
        });
      }
    }),
});
