import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type GerUserRecipes =
  inferRouterOutputs<AppRouter>["account"]["getUserRecipes"]["items"];
