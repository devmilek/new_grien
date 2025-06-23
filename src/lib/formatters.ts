import { Difficulty } from "@/db/schema";

export const formatDifficulty = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case "easy":
      return "Łatwy";
    case "medium":
      return "Średni";
    case "hard":
      return "Trudny";
    default:
      return "Nieznany poziom trudności";
  }
};
