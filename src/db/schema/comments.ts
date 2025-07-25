import { pgTable, uuid, text, timestamp, char } from "drizzle-orm/pg-core";
import { recipes } from "./recipes";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: char("user_id", {
    length: 16,
  })
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  recipeId: char("recipe_id", {
    length: 16,
  })
    .notNull()
    .references(() => recipes.id, {
      onDelete: "cascade",
    }),
  content: text("content").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  recipe: one(recipes, {
    fields: [comments.recipeId],
    references: [recipes.id],
  }),
}));

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;
