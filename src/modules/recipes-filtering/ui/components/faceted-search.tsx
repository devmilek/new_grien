"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { Accordion } from "../../../../components/ui/accordion";
import { useRecipesFilters } from "../../hooks/use-recipes-filters";
import { FilterSection } from "./filter-section";
import { Attribute } from "@/db/schema";
import { Button } from "@/components/ui/button";

interface FacetedSearchProps {
  hideAttribute?: Attribute["type"] | "categories";
}

export const FacetedSearch = ({ hideAttribute }: FacetedSearchProps) => {
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
    ...(hideAttribute === "categories"
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
    ...(hideAttribute === "cuisines"
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
    ...(hideAttribute === "occasions"
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
    ...(hideAttribute === "diets"
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

  const handleClearFilters = () => {
    setCategory("");
    setAttributesParams([]);
  };

  const hasFilters = filterSections.some(
    (section) => section.selectedItems.length > 0
  );

  return (
    <>
      <h3 className="font-display text-xl mb-2">Filtruj</h3>
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
      {hasFilters && (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleClearFilters}
        >
          Wyczyść filtry
        </Button>
      )}
    </>
  );
};
