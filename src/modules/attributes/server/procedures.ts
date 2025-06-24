import { db } from "@/db";
import { categories } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { asc } from "drizzle-orm";

export const attributesRouter = createTRPCRouter({
  getCategories: baseProcedure.query(async () => {
    const data = await db.query.categories.findMany({
      orderBy: asc(categories.name),
    });

    return data;
  }),

  getAttributes: baseProcedure.query(async () => {
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
