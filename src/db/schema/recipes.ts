import {
  boolean,
  char,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { attributes, categories } from "./attributes";
import { ingredientAliases } from "./ingredients";
import { files } from "./files";
import { user } from "./users";
import { relations } from "drizzle-orm";
import { customAlphabet } from "nanoid";

export const difficulties = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof difficulties)[number];
export const difficultiesEnum = pgEnum("difficulty", difficulties);

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  16
);

export const recipes = pgTable("recipes", {
  id: char("id", { length: 16 }).primaryKey().default(nanoid()),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  categoryId: uuid("category_id")
    .references(() => categories.id, {
      onDelete: "cascade",
    })
    .notNull(),
  licenseId: uuid("license_id").references(() => licenses.id, {
    onDelete: "set null",
  }),
  authorId: char("author_id", {
    length: 16,
  })
    .notNull()
    .references(() => user.id, {
      onDelete: "set null",
    }),
  difficulty: difficultiesEnum("difficulty").notNull(),
  portions: smallint("portions").notNull(),
  preparationTime: smallint("preparation_time").notNull(),
  fileId: uuid("file_id")
    .references(() => files.id, {
      onDelete: "cascade",
    })
    .notNull(),
  published: boolean("published").notNull().default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  category: one(categories, {
    fields: [recipes.categoryId],
    references: [categories.id],
  }),
  attributes: many(recipeAttributes),
  ingredients: many(recipeIngredients),
  preparationSteps: many(preparationSteps),
  file: one(files, {
    fields: [recipes.fileId],
    references: [files.id],
  }),
  author: one(user, {
    fields: [recipes.authorId],
    references: [user.id],
  }),
  license: one(licenses, {
    fields: [recipes.licenseId],
    references: [licenses.id],
  }),
}));

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = typeof recipes.$inferInsert;

export const recipeIngredients = pgTable(
  "recipe_ingredients",
  {
    recipeId: char("recipe_id", {
      length: 16,
    })
      .references(() => recipes.id, {
        onDelete: "cascade",
      })
      .notNull(),
    ingredientAlliasId: uuid("ingredient_allias_id")
      .references(() => ingredientAliases.id, {
        onDelete: "cascade",
      })
      .notNull(),
    quantity: numeric("quantity", {
      precision: 10,
      scale: 2,
      mode: "number",
    }).notNull(),
    unit: varchar("unit", { length: 50 }),
  },
  (t) => [primaryKey({ columns: [t.recipeId, t.ingredientAlliasId] })]
);

export const recipeIngredientsRelations = relations(
  recipeIngredients,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipeIngredients.recipeId],
      references: [recipes.id],
    }),
    ingredientAlias: one(ingredientAliases, {
      fields: [recipeIngredients.ingredientAlliasId],
      references: [ingredientAliases.id],
    }),
  })
);

export type RecipeIngredient = typeof recipeIngredients.$inferSelect;
export type InsertRecipeIngredient = typeof recipeIngredients.$inferInsert;

export const preparationSteps = pgTable("preparation_steps", {
  id: uuid("id").primaryKey().defaultRandom(),
  recipeId: char("recipe_id", {
    length: 16,
  }).references(() => recipes.id, {
    onDelete: "cascade",
  }),
  stepNumber: smallint("step_number").notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  fileId: uuid("file_id").references(() => files.id, {
    onDelete: "cascade",
  }),
});

export const preparationStepsRelations = relations(
  preparationSteps,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [preparationSteps.recipeId],
      references: [recipes.id],
    }),
    file: one(files, {
      fields: [preparationSteps.fileId],
      references: [files.id],
    }),
  })
);

export type PreparationStep = typeof preparationSteps.$inferSelect;
export type InsertPreparationStep = typeof preparationSteps.$inferInsert;

export const recipeAttributes = pgTable(
  "recipe_attributes",
  {
    recipeId: char("recipe_id", {
      length: 16,
    })
      .references(() => recipes.id, {
        onDelete: "cascade",
      })
      .notNull(),
    attributeId: uuid("attribute_id")
      .references(() => attributes.id, {
        onDelete: "cascade",
      })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.recipeId, t.attributeId] })]
);

export const recipeAttributesRelations = relations(
  recipeAttributes,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipeAttributes.recipeId],
      references: [recipes.id],
    }),
    attribute: one(attributes, {
      fields: [recipeAttributes.attributeId],
      references: [attributes.id],
    }),
  })
);

export type RecipeAttribute = typeof recipeAttributes.$inferSelect;
export type InsertRecipeAttribute = typeof recipeAttributes.$inferInsert;

export const recipeLikes = pgTable(
  "likes",
  {
    userId: char("user_id", {
      length: 16,
    })
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),
    recipeId: char("recipe_id", {
      length: 16,
    })
      .notNull()
      .references(() => recipes.id, {
        onDelete: "cascade",
      }),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.recipeId],
    }),
  ]
);

export const licenses = pgTable("licenses", {
  id: uuid().primaryKey().defaultRandom(),

  author: varchar("author", {
    length: 255,
  }).notNull(),
  sourceUrl: varchar("source_url", {
    length: 255,
  }).notNull(),
  originalTitle: varchar("original_title", {
    length: 255,
  }),
  imagesAuthor: varchar("image_author", {
    length: 255,
  }),
  licenseType: varchar("license_type", { length: 50 }).notNull(), // np. "CC BY-NC-SA 3.0", "All rights reserved"
  licenseLink: varchar("license_link", { length: 255 }).notNull(),
});

export type Licence = typeof licenses.$inferSelect;
export type LicenceInsert = typeof licenses.$inferInsert;

export const licencesRelations = relations(licenses, ({ many }) => ({
  recipes: many(recipes),
}));
