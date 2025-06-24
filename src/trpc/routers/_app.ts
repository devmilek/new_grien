import { createRecipeRouter } from "@/modules/create-recipe/server/procedures";
import { createTRPCRouter } from "../init";
import { attributesRouter } from "@/modules/attributes/server/procedures";

export const appRouter = createTRPCRouter({
  attributes: attributesRouter,
  createRecipe: createRecipeRouter,
});

export type AppRouter = typeof appRouter;
