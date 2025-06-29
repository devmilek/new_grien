import { z } from "zod/v4";

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Komentarz nie może być pusty")
    .max(500, "Komentarz nie może przekraczać 500 znaków"),
});

export type CommentSchema = z.infer<typeof commentSchema>;
