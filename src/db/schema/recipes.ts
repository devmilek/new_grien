import {
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { categories } from "./attributes";
import { ingredients } from "./ingredients";
import { files } from "./files";

export const difficulties = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof difficulties)[number];
export const difficultiesEnum = pgEnum("difficulty", difficulties);

export const recipes = pgTable("recipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "cascade",
  }),
  difficulty: difficultiesEnum("difficulty").notNull(),
  portions: smallint("portions").notNull(),
  preparationTime: smallint("preparation_time").notNull(),
  fileId: uuid("file_id").references(() => files.id, {
    onDelete: "cascade",
  }),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = typeof recipes.$inferInsert;

export const recipeIngredients = pgTable(
  "recipe_ingredients",
  {
    recipeId: uuid("recipe_id").references(() => recipes.id, {
      onDelete: "cascade",
    }),
    ingredientId: uuid("ingredient_id").references(() => ingredients.id, {
      onDelete: "cascade",
    }),
    quantity: numeric("quantity", {
      precision: 10,
      scale: 2,
      mode: "number",
    }).notNull(),
    unit: varchar("unit", { length: 50 }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.recipeId, t.ingredientId] })]
);

export type RecipeIngredient = typeof recipeIngredients.$inferSelect;
export type InsertRecipeIngredient = typeof recipeIngredients.$inferInsert;

export const preparationSteps = pgTable("preparation_steps", {
  id: uuid("id").primaryKey().defaultRandom(),
  recipeId: uuid("recipe_id").references(() => recipes.id, {
    onDelete: "cascade",
  }),
  stepNumber: smallint("step_number").notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  fileId: uuid("file_id").references(() => files.id, {
    onDelete: "cascade",
  }),
});

export type PreparationStep = typeof preparationSteps.$inferSelect;
export type InsertPreparationStep = typeof preparationSteps.$inferInsert;

export const recipeAttributes = pgTable(
  "recipe_attributes",
  {
    recipeId: uuid("recipe_id").references(() => recipes.id, {
      onDelete: "cascade",
    }),
    attributeId: uuid("attribute_id").references(() => categories.id, {
      onDelete: "cascade",
    }),
  },
  (t) => [primaryKey({ columns: [t.recipeId, t.attributeId] })]
);

export type RecipeAttribute = typeof recipeAttributes.$inferSelect;
export type InsertRecipeAttribute = typeof recipeAttributes.$inferInsert;
