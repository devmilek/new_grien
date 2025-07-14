import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const viewLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
});

export const searchLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
});

export const mutationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.tokenBucket(5, "1 m", 10),
});

export const imageUploadLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
});
