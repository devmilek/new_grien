"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { Accordion } from "../../../../components/ui/accordion";
import { useRecipesFilters } from "../../hooks/use-recipes-filters";
import { FilterSection } from "./filter-section";

interface FacetedSearchProps {
  hideCategories?: boolean;
  hideCuisines?: boolean;
  hideOccasions?: boolean;
  hideDiets?: boolean;
}

export const FacetedSearch = ({
  hideCategories,
  hideCuisines,
  hideDiets,
  hideOccasions,
}: FacetedSearchProps) => {
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.attributes.getCategories.queryOptions()
  );
  const { data: attributes } = useSuspenseQuery(
    trpc.attributes.getAttributes.queryOptions()
  );

  const {
    category,
    setCategory,
    attributes: attributesParams,
    setAttributes: setAttributesParams,
  } = useRecipesFilters();

  // Handlers zoptymalizowane z useCallback
  const handleCategoryToggle = useCallback(
    (slug: string, checked: boolean) => {
      setCategory(checked ? slug : "");
    },
    [setCategory]
  );

  const handleAttributeToggle = useCallback(
    (slug: string, checked: boolean) => {
      if (checked) {
        setAttributesParams((prev) => [...prev, slug]);
      } else {
        setAttributesParams((prev) => prev.filter((attr) => attr !== slug));
      }
    },
    [setAttributesParams]
  );

  // Konfiguracja sekcji filtrów
  const filterSections = [
    ...(hideCategories
      ? []
      : [
          {
            title: "Kategorie",
            items: categories,
            selectedItems: category,
            onToggle: handleCategoryToggle,
            isMultiSelect: false,
          },
        ]),
    ...(hideCuisines
      ? []
      : [
          {
            title: "Kuchnie świata",
            items: attributes.cuisines,
            selectedItems: attributesParams,
            onToggle: handleAttributeToggle,
            isMultiSelect: true,
          },
        ]),
    ...(hideOccasions
      ? []
      : [
          {
            title: "Okazje",
            items: attributes.occasions,
            selectedItems: attributesParams,
            onToggle: handleAttributeToggle,
            isMultiSelect: true,
          },
        ]),
    ...(hideDiets
      ? []
      : [
          {
            title: "Diety",
            items: attributes.diets,
            selectedItems: attributesParams,
            onToggle: handleAttributeToggle,
            isMultiSelect: true,
          },
        ]),
  ];

  return (
    <div className="p-6 bg-white rounded-2xl border">
      <Accordion type="multiple">
        {filterSections.map((section) => (
          <FilterSection
            key={section.title}
            title={section.title}
            items={section.items}
            selectedItems={section.selectedItems}
            onToggle={section.onToggle}
            isMultiSelect={section.isMultiSelect}
          />
        ))}
      </Accordion>
    </div>
  );
};
