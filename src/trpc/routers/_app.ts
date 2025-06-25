import { createRecipeRouter } from "@/modules/create-recipe/server/procedures";
import { createTRPCRouter } from "../init";
import { attributesRouter } from "@/modules/attributes/server/procedures";
import { accountRouter } from "@/modules/account/server/procedures";

export const appRouter = createTRPCRouter({
  attributes: attributesRouter,
  createRecipe: createRecipeRouter,
  account: accountRouter,
});

export type AppRouter = typeof appRouter;
