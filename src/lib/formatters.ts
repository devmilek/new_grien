import { AttributeType, Difficulty } from "@/db/schema";
import {
  EarthIcon,
  LeafIcon,
  LucideIcon,
  PartyPopper,
  TagsIcon,
} from "lucide-react";

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

export const formatTime = (time: number): string => {
  if (time < 60) {
    return `${time} min`;
  } else {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return `${hours} godz ${minutes} min`;
  }
};

export const formatAttributeType = (type: AttributeType): string => {
  switch (type) {
    case "cuisines":
      return "Kuchnia";
    case "diets":
      return "Dieta";
    case "occasions":
      return "Okazja";
    default:
      return "Nieznany typ atrybutu";
  }
};

export const formatAttributeIcon = (type: AttributeType): LucideIcon => {
  switch (type) {
    case "cuisines":
      return EarthIcon;
    case "diets":
      return LeafIcon;
    case "occasions":
      return PartyPopper;
    default:
      return TagsIcon;
  }
};
