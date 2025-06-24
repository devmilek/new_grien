import { sql } from "drizzle-orm";
import {
  boolean,
  pgTable,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const ingredients = pgTable("ingredients", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const ingredientAliases = pgTable(
  "ingredient_aliases",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ingredientId: uuid("ingredient_id")
      .notNull()
      .references(() => ingredients.id, { onDelete: "cascade" }),
    alias: varchar("alias", { length: 100 }).notNull(),
    isPrimary: boolean("is_primary").notNull().default(false),
    searchKey: varchar("search_key").generatedAlwaysAs(
      sql`unaccent_immutable(lower(alias))`
    ),

    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    unique().on(t.ingredientId, t.alias),
    uniqueIndex()
      .on(t.ingredientId)
      .where(sql`is_primary = TRUE`),
  ]
);
