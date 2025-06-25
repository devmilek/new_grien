"use client";

import { DEFAULT_PAGE } from "@/contstants";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import React, { useEffect } from "react";
import {
  UserRecipeCard,
  UserRecipeCardSkeleton,
} from "../components/user-recipe-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const UserRecipesList = () => {
  const trpc = useTRPC();

  const { ref, inView } = useInView({
    threshold: 0.3,
  });

  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.account.getUserRecipes.infiniteQueryOptions(
        {
          cursor: DEFAULT_PAGE,
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
    <div>
      <header>
        <h1 className="font-display text-2xl">Twoje przepisy</h1>
      </header>
      <div className="mt-4 space-y-4">
        {recipes.map((recipe) => (
          <UserRecipeCard key={recipe.id} data={recipe} />
        ))}
        {hasNextPage && (
          <div ref={ref}>
            {Array.from({ length: 1 }).map((_, index) => (
              <UserRecipeCardSkeleton key={index} />
            ))}
          </div>
        )}
        {recipes.length === 0 && (
          <EmptyState
            title="Brak przepisów"
            description="Nie masz jeszcze żadnych przepisów. Zacznij tworzyć swoje ulubione dania!"
          >
            <Button asChild>
              <Link href="/utworz-przepis">Utwórz przepis</Link>
            </Button>
          </EmptyState>
        )}
      </div>
    </div>
  );
};
