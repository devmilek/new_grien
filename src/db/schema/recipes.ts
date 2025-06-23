import { pgEnum } from "drizzle-orm/pg-core";

export const difficulties = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof difficulties)[number];
export const difficultiesEnum = pgEnum("difficulty", difficulties);
