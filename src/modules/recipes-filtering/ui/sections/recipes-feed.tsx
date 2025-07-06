"use client";

import React, { useEffect } from "react";
import { SortButton } from "../components/sort-button";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { DEFAULT_PAGE } from "@/contstants";
import { useInView } from "react-intersection-observer";
import { useRecipesFilters } from "../../hooks/use-recipes-filters";
import {
  FilteredRecipeCard,
  FilteredRecipeCardSkeleton,
} from "../components/filtered-recipe-card";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export const RecipesFeed = ({
  categorySlug,
  attributesSlugs,
}: {
  categorySlug?: string;
  attributesSlugs?: string[];
}) => {
  const trpc = useTRPC();

  const { ref, inView } = useInView({
    threshold: 0.3,
  });

  const { attributes, sort, category } = useRecipesFilters();

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.recipesFiltering.getRecipes.infiniteQueryOptions(
        {
          cursor: DEFAULT_PAGE,
          categorySlug: categorySlug || category,
          attributesSlugs: [...(attributesSlugs || []), ...attributes],
          sortBy: sort,
        },
        {
          initialCursor: 1,
          getNextPageParam: (lastPage) => {
            if (!lastPage.hasMore) return undefined;
            return lastPage.cursor + 1;
          },
        }
      )
    );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const recipes = data.pages.flatMap((page) => page.items);

  return (
    <div className="border p-6 bg-white rounded-2xl flex-1">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-display">Wyniki</h2>
        <SortButton />
      </header>
      <div className="space-y-6 mt-5">
        {recipes.map((recipe) => (
          <FilteredRecipeCard key={recipe.id} data={recipe} />
        ))}
        {recipes.length === 0 && (
          <EmptyState
            title="Brak przepisów"
            description="Nie znaleziono żadnych przepisów pasujących do Twoich filtrów."
          />
        )}
        {hasNextPage && (
          <div ref={ref} className="text-center mt-6">
            {isFetchingNextPage && <FilteredRecipeCardSkeleton />}
          </div>
        )}
      </div>
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

      {/* Recipe cards skeleton */}
      <div className="space-y-6 mt-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <FilteredRecipeCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};
