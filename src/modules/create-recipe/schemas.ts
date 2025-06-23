import { z } from "zod/v4";

export const createRecipeSchema = z.object({
  title: z.string().min(1, "Tytuł przepisu jest wymagany"),
  description: z
    .string()
    .min(1, "Opis przepisu jest wymagany")
    .max(500, "Opis przepisu nie może przekraczać 500 znaków"),
});

export type CreateRecipeSchema = z.infer<typeof createRecipeSchema>;
