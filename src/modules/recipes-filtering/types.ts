import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type FilteredRecipes =
  inferRouterOutputs<AppRouter>["recipesFiltering"]["getRecipes"]["items"];
