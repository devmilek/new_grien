import { db } from "@/db";
import { categories } from "@/db/schema";
import { viewLimiter } from "@/lib/rate-limiters";
import {
  baseProcedure,
  createRateLimitMiddleware,
  createTRPCRouter,
} from "@/trpc/init";
import { asc } from "drizzle-orm";

export const attributesRouter = createTRPCRouter({
  getCategories: baseProcedure
    .use(createRateLimitMiddleware(viewLimiter))
    .query(async () => {
      const data = await db.query.categories.findMany({
        orderBy: asc(categories.name),
      });

      return data;
    }),

  getAttributes: baseProcedure
    .use(createRateLimitMiddleware(viewLimiter))
    .query(async () => {
      const data = await db.query.attributes.findMany();

      const cuisines = data.filter((attr) => attr.type === "cuisines");
      const diets = data.filter((attr) => attr.type === "diets");
      const occasions = data.filter((attr) => attr.type === "occasions");

      return {
        cuisines,
        diets,
        occasions,
        all: data,
      };
    }),
});
