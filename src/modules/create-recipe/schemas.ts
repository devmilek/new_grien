import { difficulties } from "@/db/schema";
import { z } from "zod/v4";
import { MAX_FILE_SIZE, SUPPORTED_IMAGE_TYPES } from "../storage/config";

export const ingredientSchema = z.object({
  quantity: z.number().min(0, "Ilość składnika musi być większa lub równa 0"),
  unit: z.string().min(1, "Jednostka miary jest wymagana"),
  ingredient: z
    .object({
      id: z.uuid("Nieprawidłowy identyfikator składnika"),
      name: z.string().min(1, "Nazwa składnika jest wymagana"),
    })
    .refine((data) => data.id !== "", {
      message: "Identyfikator składnika nie może być pusty",
    }),
});

export type IngredientSchema = z.infer<typeof ingredientSchema>;

export const createRecipeSchema = z.object({
  title: z.string().min(1, "Tytuł przepisu jest wymagany"),
  description: z
    .string()
    .min(1, "Opis przepisu jest wymagany")
    .max(500, "Opis przepisu nie może przekraczać 500 znaków"),
  categoryId: z.uuid("Nieprawidłowy identyfikator kategorii"),
  // TODO: add validation for image file type and size
  image: z
    .file({
      error: "Zdjęcie przepisu jest wymagane",
    })
    .max(MAX_FILE_SIZE)
    .mime(SUPPORTED_IMAGE_TYPES)
    .optional(),
  difficulty: z.enum(difficulties, {
    error: "Wybierz poziom trudności przepisu",
  }),
  portions: z
    .number({
      error: "Liczba porcji jest wymagana",
    })
    .positive("Liczba porcji musi być większa niż 0"),
  preparationTime: z
    .number({
      error: "Czas przygotowania jest wymagany",
    })
    .positive("Czas przygotowania musi być większy niż 0"),
  ingredients: z
    .array(ingredientSchema)
    .min(1, "Musisz dodać co najmniej jeden składnik")
    .max(50, "Maksymalnie 50 składników"),
  steps: z
    .array(
      z.object({
        description: z
          .string()
          .min(1, "Opis kroku jest wymagany")
          .max(500, "Opis kroku nie może przekraczać 500 znaków"),
        image: z.string().optional(),
      })
    )
    .max(20, "Maksymalnie 20 kroków przygotowania")
    .min(1, "Musisz dodać co najmniej jeden krok przygotowania"),
  attributes: z
    .array(z.uuid("Nieprawidłowy identyfikator atrybutu"))
    .max(20, "Maksymalnie 20 kroków przygotowania"),
});

// recipe schema without image validation but with imageId
export const createRecipeSchemaServer = createRecipeSchema
  .omit({
    image: true,
  })
  .extend({
    imageId: z.uuid(),
    published: z.boolean(),
  });

export type CreateRecipeSchema = z.infer<typeof createRecipeSchema>;

export const editRecipeSchemaServer = createRecipeSchemaServer.extend({
  id: z.string("Nieprawidłowy identyfikator przepisu"),
});
