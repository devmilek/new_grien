import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const attributeTypes = ["cuisines", "diets", "occasions", "categories"] as const;
export type AttributeType = (typeof attributeTypes)[number];
export const attributesTypesEnum = pgEnum("attribute_type", attributeTypes);

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", {
    length: 100,
  }).notNull(),
  slug: varchar("slug", {
    length: 100,
  })
    .notNull()
    .unique(),
  description: varchar("description", {
    length: 255,
  }).notNull(),
});

export type Category = typeof categories.$inferSelect;
export type CategoryInsert = typeof categories.$inferInsert;

export const attributes = pgTable("attributes", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: attributesTypesEnum("type").notNull(),
  name: varchar("name", {
    length: 100,
  }).notNull(),
  slug: varchar("slug", {
    length: 100,
  })
    .notNull()
    .unique(),
  description: varchar("description", {
    length: 255,
  }).notNull(),
});

export type TAttribute = typeof attributes.$inferSelect;
export type AttributeInsert = typeof attributes.$inferInsert;
