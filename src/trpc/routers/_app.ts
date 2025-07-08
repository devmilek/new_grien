import { createRecipeRouter } from "@/modules/create-recipe/server/procedures";
import { createTRPCRouter } from "../init";
import { attributesRouter } from "@/modules/attributes/server/procedures";
import { accountRouter } from "@/modules/account/server/procedures";
import { recipeDetailsRouter } from "@/modules/recipe-details/server/procedures";
import { commentsRouter } from "@/modules/comments/server/procedures";
import { recipesFilteringRouter } from "@/modules/recipes-filtering/server/procedures";
import { homeRouter } from "@/modules/home/server/procedures";

export const appRouter = createTRPCRouter({
  attributes: attributesRouter,
  createRecipe: createRecipeRouter,
  account: accountRouter,
  recipeDetails: recipeDetailsRouter,
  comments: commentsRouter,
  recipesFiltering: recipesFilteringRouter,
  home: homeRouter,
});

export type AppRouter = typeof appRouter;
