import {
  ChartNoAxesColumnDecreasing,
  ClockIcon,
  SliceIcon,
  TagIcon,
  TagsIcon,
} from "lucide-react";
import { formatDifficulty } from "@/lib/formatters";
import { GetRecipe } from "./types";

export const getRecipeBadges = (data: GetRecipe) => {
  const cuisinesAttributes = data.attributes.filter(
    (attr) => attr.attribute.type === "cuisines"
  );

  const dietsAttributes = data.attributes.filter(
    (attr) => attr.attribute.type === "diets"
  );

  const occasionsAttributes = data.attributes.filter(
    (attr) => attr.attribute.type === "occasions"
  );

  const badges = [
    {
      icon: ChartNoAxesColumnDecreasing,
      label: formatDifficulty(data.difficulty),
    },
    {
      icon: TagIcon,
      label: data.category.name,
    },
    {
      icon: ClockIcon,
      label: `${data.preparationTime} min`,
    },
    {
      icon: SliceIcon,
      label: `${data.portions} ${data.portions === 1 ? "porcja" : "porcji"}`,
    },
  ];

  // Helper function to avoid code duplication
  const addAttributeBadges = (
    attributes: typeof cuisinesAttributes,
    type: string,
    singularSuffix: string,
    pluralSuffix: string
  ) => {
    if (attributes.length > 0) {
      if (attributes.length > 2) {
        badges.push({
          icon: TagsIcon,
          label: `${attributes.length} ${pluralSuffix}`,
        });
      } else {
        attributes.forEach((attr) => {
          badges.push({
            icon: TagsIcon,
            label: attr.attribute.name,
          });
        });
      }
    }
  };

  addAttributeBadges(cuisinesAttributes, "cuisines", "kuchni", "kuchni");
  addAttributeBadges(dietsAttributes, "diets", "dieta", "diet");
  addAttributeBadges(occasionsAttributes, "occasions", "okazja", "okazji");

  return badges;
};
