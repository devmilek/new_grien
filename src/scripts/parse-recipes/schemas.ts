import { difficulties } from "@/db/schema";
import { z } from "zod";
import z4 from "zod/v4";

export const parseRecipeSchema = ({
  categories,
  attributes,
}: {
  categories: string[];
  attributes: string[];
}) => {
  if (categories.length === 0) {
    throw new Error("Categories array cannot be empty");
  }

  return z.object({
    title: z.string().min(1),
    description: z.string().min(1).max(500),
    category: z.enum(categories as [string, ...string[]]),
    difficulty: z.enum(difficulties),
    portions: z.number().positive(),
    preparationTime: z.number().positive(),
    ingredients: z
      .array(
        z.object({
          name: z.string().min(1),
          quantity: z.number().min(0),
          unit: z.string().min(1),
        })
      )
      .min(1)
      .max(50),
    steps: z.array(z.string()).max(20).min(1),
    attributes: z.array(z.enum(attributes as [string, ...string[]])).max(20),
  });
};

export const parsedIngredientSchema = z4.object({
  name: z4.string().min(1),
  quantity: z4.number().min(0),
  unit: z4.string().min(1),
  aliasName: z4.string().optional(),
  searchKey: z4.string().optional(),
  aliasId: z4.string().optional(),
});

export type ParsedIngredientSchema = z4.infer<typeof parsedIngredientSchema>;

export const parsedRecipeSchema = z4.object({
  title: z4.string().min(1),
  slug: z4.string().min(1),
  description: z4.string().min(1).max(500),
  category: z4.string(),
  difficulty: z4.enum(difficulties),
  portions: z4.number().positive(),
  preparationTime: z4.number().positive(),
  ingredients: z4.array(parsedIngredientSchema).min(1).max(50),
  steps: z4.array(z4.string()),
  attributes: z4.array(z4.string()).max(20),
  fileKey: z4.string(),
  imageUrl: z4.url(),
  rawDescription: z4.string(),
});

export type ParsedRecipeSchema = z4.infer<typeof parsedRecipeSchema>;
