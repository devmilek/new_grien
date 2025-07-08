"use client";

import React, { Suspense } from "react";
import { SortButton } from "../components/sort-button";
import { Skeleton } from "@/components/ui/skeleton";
import { MobileFacatedSearch } from "../components/mobile-faceted-search";
import { RecipesList, RecipesListSkeleton } from "../components/recipes-list";

export const RecipesFeed = ({
  categorySlug,
  attributesSlugs,
  authorId,
}: {
  categorySlug?: string;
  attributesSlugs?: string[];
  authorId?: string;
}) => {
  return (
    <div className="border p-6 bg-white rounded-2xl flex-1 @container">
      <header className="flex justify-between flex-col gap-4 @md:flex-row">
        <h2 className="text-2xl font-display">Wyniki</h2>
        <div className="flex gap-2">
          <MobileFacatedSearch className="lg:hidden" />
          <SortButton />
        </div>
      </header>
      <Suspense fallback={<RecipesListSkeleton />}>
        <RecipesList
          categorySlug={categorySlug}
          attributesSlugs={attributesSlugs}
          authorId={authorId}
        />
      </Suspense>
    </div>
  );
};

export const RecipesFeedSkeleton = () => {
  return (
    <div className="border p-6 bg-white rounded-2xl flex-1">
      {/* Header skeleton */}
      <header className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" /> {/* "Wyniki" title */}
        <Skeleton className="h-10 w-28 rounded-md" /> {/* Sort button */}
      </header>

      <RecipesListSkeleton />
    </div>
  );
};
