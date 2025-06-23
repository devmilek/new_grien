import { z } from "zod/v4";

export const signUpSchema = z.object({
  name: z.string().min(1, "Imię jest wymagane"),
  email: z.email("Nieprawidłowy adres email").min(1, "Email jest wymagany"),
  username: z
    .string()
    .min(1, "Nazwa użytkownika jest wymagana")
    .max(32, "Nazwa użytkownika nie może przekraczać 32 znaków")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Nazwa użytkownika może zawierać tylko litery, cyfry i podkreślenia"
    ),
  password: z
    .string()
    .min(8, "Hasło musi mieć co najmniej 8 znaków")
    .max(64, "Hasło nie może przekraczać 64 znaków"),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.email("Nieprawidłowy adres email").min(1, "Email jest wymagany"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

export type SignInSchema = z.infer<typeof signInSchema>;
