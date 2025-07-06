import {
  ChartNoAxesColumnDecreasing,
  ClockIcon,
  SliceIcon,
  TagIcon,
} from "lucide-react";
import {
  formatAttributeIcon,
  formatAttributeType,
  formatDifficulty,
  formatTime,
} from "@/lib/formatters";
import { GetRecipe } from "./types";
import { pluralizePortions } from "@/lib/pluralize";

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
      tooltip: "Poziom trudności",
    },
    {
      icon: TagIcon,
      label: data.category.name,
      tooltip: "Kategoria",
    },
    {
      icon: ClockIcon,
      label: formatTime(data.preparationTime),
      tooltip: "Czas przygotowania",
    },
    {
      icon: SliceIcon,
      label: pluralizePortions(data.portions),
      tooltip: "Ilość porcji",
    },
  ];

  // Helper function to avoid code duplication
  const addAttributeBadges = (
    attributes: typeof cuisinesAttributes,
    pluralSuffix: string
  ) => {
    if (attributes.length > 0) {
      if (attributes.length > 2) {
        badges.push({
          icon: formatAttributeIcon(attributes[0].attribute.type),
          label: `${attributes.length} ${pluralSuffix}`,
          tooltip:
            formatAttributeType(attributes[0].attribute.type) +
            " " +
            attributes.join(", "),
        });
      } else {
        attributes.forEach((attr) => {
          badges.push({
            icon: formatAttributeIcon(attr.attribute.type),
            label: attr.attribute.name,
            tooltip: formatAttributeType(attr.attribute.type),
          });
        });
      }
    }
  };

  addAttributeBadges(cuisinesAttributes, "cuisines");
  addAttributeBadges(dietsAttributes, "diets");
  addAttributeBadges(occasionsAttributes, "occasions");

  return badges;
};
