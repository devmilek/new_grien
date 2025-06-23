import { db } from "@/db";
import { categories } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { asc } from "drizzle-orm";

export const attributesRouter = createTRPCRouter({
  getCategories: baseProcedure.query(async () => {
    const data = await db.query.categories.findMany({
      orderBy: asc(categories.name),
    });

    console.log("Fetched categories:", data);

    return data;
  }),
});
