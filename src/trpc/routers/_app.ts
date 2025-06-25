import { createRecipeRouter } from "@/modules/create-recipe/server/procedures";
import { createTRPCRouter } from "../init";
import { attributesRouter } from "@/modules/attributes/server/procedures";
import { accountRouter } from "@/modules/account/server/procedures";
import { recipeDetailsRouter } from "@/modules/recipe-details/server/procedures";

export const appRouter = createTRPCRouter({
  attributes: attributesRouter,
  createRecipe: createRecipeRouter,
  account: accountRouter,
  recipeDetails: recipeDetailsRouter,
});

export type AppRouter = typeof appRouter;
