import { z } from "zod";

export const editProfileSchema = z.object({
  name: z.string().min(1, "Imię jest wymagane").trim(),
  username: z
    .string()
    .min(1, "Nazwa użytkownika jest wymagana")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Nazwa użytkownika może zawierać tylko litery, cyfry i podkreślenia"
    ),
  bio: z
    .string()
    .max(500, {
      message: "Bio nie może przekraczać 500 znaków",
    })
    .optional(),
});

export type EditProfileSchema = z.infer<typeof editProfileSchema>;
