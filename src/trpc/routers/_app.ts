import { createTRPCRouter } from "../init";
import { attributesRouter } from "@/modules/attributes/server/procedures";

export const appRouter = createTRPCRouter({
  attributes: attributesRouter,
});

export type AppRouter = typeof appRouter;
