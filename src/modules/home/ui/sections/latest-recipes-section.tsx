"use client";

import { EmptyState } from "@/components/empty-state";
import { DEFAULT_PAGE } from "@/contstants";
import {
  FilteredRecipeCard,
  FilteredRecipeCardSkeleton,
} from "@/modules/recipes-filtering/ui/components/filtered-recipe-card";
import { SortButton } from "@/modules/recipes-filtering/ui/components/sort-button";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export const LatestRecipesSection = () => {
  const trpc = useTRPC();

  const { ref, inView } = useInView({
    threshold: 0.3,
  });

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery(
      trpc.recipesFiltering.getRecipes.infiniteQueryOptions(
        {
          cursor: DEFAULT_PAGE,
          sortBy: "newest",
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

  const recipes = data?.pages.flatMap((page) => page.items) || [];

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
