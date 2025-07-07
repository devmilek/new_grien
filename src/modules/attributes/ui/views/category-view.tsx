import { DEFAULT_PAGE } from "@/contstants";
import { db } from "@/db";
import { categories, recipes } from "@/db/schema";
import { loadRecipesSearchParams } from "@/modules/recipes-filtering/params";
import { FacetedSearch } from "@/modules/recipes-filtering/ui/components/faceted-search";
import { RecipesFeed } from "@/modules/recipes-filtering/ui/sections/recipes-feed";
import { RecipesListHero } from "@/modules/recipes-filtering/ui/sections/recipes-list-hero";
import { prefetch, trpc } from "@/trpc/server";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { SearchParams } from "nuqs";
import React from "react";

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
      <div className="flex gap-4 items-start mt-4">
        <div className="max-w-[300px] w-full hidden p-6 bg-white rounded-2xl border lg:block">
          <FacetedSearch hideAttribute="categories" />
        </div>
        <RecipesFeed categorySlug={slug} />
      </div>
    </div>
  );
};

export default CategoryPage;
