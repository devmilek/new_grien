import { getCurrentSession } from "@/lib/auth/get-current-session";
import { initTRPC, TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
  const { session, user } = await getCurrentSession();

  const headersStore = await headers();

  const getRealIP = () => {
    // Check common IP headers
    const ipHeaders = [
      "x-forwarded-for",
      "x-real-ip",
      "x-client-ip",
      "cf-connecting-ip", // Cloudflare
      "x-forwarded",
      "forwarded-for",
      "forwarded",
    ];

    for (const header of ipHeaders) {
      const value = headersStore.get(header);
      if (value) {
        // x-forwarded-for can contain multiple IPs: "client, proxy1, proxy2"
        // Take the first one (client IP)
        const ip = value.split(",")[0].trim();

        // Validate IP (basic check)
        if (
          ip &&
          ip !== "unknown" &&
          !ip.startsWith("127.") &&
          !ip.startsWith("::1")
        ) {
          return ip;
        }
      }
    }

    return "127.0.0.1";
  };

  const ip = getRealIP();

  return {
    session,
    user,
    ip,
  };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const { session, user } = ctx;

  if (!session || !user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user,
      session,
    },
  });
});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const { user } = ctx;

  if (!user || user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to access this resource.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});

export const createRateLimitMiddleware = (limiter: Ratelimit) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async ({ ctx, next }: { ctx: Context; next: () => Promise<any> }) => {
    const fingerprint = ctx.ip;

    const { success, reset } = await limiter.limit(fingerprint);

    if (!success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: `Za dużo żądań, sprobój ponownie za ${Math.ceil((reset - Date.now()) / 1000)}s.`,
      });
    }

    return next();
  };
};
