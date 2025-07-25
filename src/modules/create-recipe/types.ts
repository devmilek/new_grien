import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type GetRecipe =
  inferRouterOutputs<AppRouter>["createRecipe"]["getRecipe"];
