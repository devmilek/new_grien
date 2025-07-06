import { DEFAULT_PAGE } from "@/contstants";
import { db } from "@/db";
import { categories, recipes } from "@/db/schema";
import { loadRecipesSearchParams } from "@/modules/recipes-filtering/params";
import { FacetedSearch } from "@/modules/recipes-filtering/ui/components/faceted-search";
import {
  RecipesFeed,
  RecipesFeedSkeleton,
} from "@/modules/recipes-filtering/ui/sections/recipes-feed";
import { RecipesListHero } from "@/modules/recipes-filtering/ui/sections/recipes-list-hero";
import { prefetch, trpc } from "@/trpc/server";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { SearchParams } from "nuqs";
import React, { Suspense } from "react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
  const { slug } = await params;
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });

  if (!category) {
    return notFound();
  }

  const { atrybuty, sort } = await loadRecipesSearchParams(searchParams);

  prefetch(
    trpc.recipesFiltering.getRecipes.infiniteQueryOptions({
      cursor: DEFAULT_PAGE,
      categorySlug: category.slug,
      attributesSlugs: atrybuty,
      sortBy: sort,
    })
  );

  const recipesCount = await db.$count(
    recipes,
    eq(recipes.categoryId, category.id)
  );

  return (
    <div className="container">
      <RecipesListHero
        heading={category.name}
        subheading={`${recipesCount} przepisów w tej kategorii`}
        imageUrl="/food.jpg"
      />
      <div className="flex gap-6 items-start">
        <div className="max-w-[350px] w-full">
          <FacetedSearch hideAttribute="categories" />
        </div>
        <Suspense fallback={<RecipesFeedSkeleton />}>
          <RecipesFeed categorySlug={slug} />
        </Suspense>
      </div>
    </div>
  );
};

export default CategoryPage;
