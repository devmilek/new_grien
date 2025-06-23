import { difficulties } from "@/db/schema";
import { z } from "zod/v4";

export const createRecipeSchema = z.object({
  title: z.string().min(1, "Tytuł przepisu jest wymagany"),
  description: z
    .string()
    .min(1, "Opis przepisu jest wymagany")
    .max(500, "Opis przepisu nie może przekraczać 500 znaków"),
  categoryId: z.uuid("Nieprawidłowy identyfikator kategorii"),
  difficulty: z.enum(difficulties),
  portions: z.number().positive("Liczba porcji musi być większa niż 0"),
  preparationTime: z
    .number()
    .positive("Czas przygotowania musi być większy niż 0"),
});

export type CreateRecipeSchema = z.infer<typeof createRecipeSchema>;
