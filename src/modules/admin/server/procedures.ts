import { db } from "@/db";
import { recipes } from "@/db/schema";
import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";

export const adminRouter = createTRPCRouter({
  getRecipes: adminProcedure
    // .input(
    //   z.object({
    //     skip: z.number().default(0),
    //     take: z.number().default(10),
    //   })
    // )
    .query(async ({ input }) => {
      //   const { skip, take } = input;

      const data = await db.query.recipes.findMany({
        // offset: skip,
        // limit: take,
      });

      const total = await db.$count(recipes);

      return {
        data,
        total,
      };
    }),
});
