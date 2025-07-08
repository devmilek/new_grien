"use client";

import React, { useEffect } from "react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { DEFAULT_PAGE } from "@/contstants";
import { useInView } from "react-intersection-observer";
import { useRecipesFilters } from "../../hooks/use-recipes-filters";
import {
  FilteredRecipeCard,
  FilteredRecipeCardSkeleton,
} from "./filtered-recipe-card";
import { EmptyState } from "@/components/empty-state";

interface RecipesListProps {
  categorySlug?: string;
  attributesSlugs?: string[];
  authorId?: string;
}

export const RecipesList = ({
  categorySlug,
  attributesSlugs,
  authorId,
}: RecipesListProps) => {
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
          authorId: authorId,
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
    <div className="space-y-10 lg:space-y-6 mt-5">
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
  );
};

export const RecipesListSkeleton = () => {
  return (
    <div className="space-y-6 mt-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <FilteredRecipeCardSkeleton key={index} />
      ))}
    </div>
  );
};
