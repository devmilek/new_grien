import { DEFAULT_PAGE } from "@/contstants";
import { db } from "@/db";
import { attributes, recipeAttributes } from "@/db/schema";
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

interface OccasionsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

const CuisinePage = async ({ params, searchParams }: OccasionsPageProps) => {
  const { slug } = await params;
  const attribute = await db.query.attributes.findFirst({
    where: eq(attributes.slug, slug),
  });

  if (!attribute) {
    return notFound();
  }

  if (attribute.type !== "diets") {
    return notFound();
  }

  const { atrybuty, sort, kategoria } = await loadRecipesSearchParams(
    searchParams
  );

  prefetch(
    trpc.recipesFiltering.getRecipes.infiniteQueryOptions({
      cursor: DEFAULT_PAGE,
      categorySlug: kategoria,
      attributesSlugs: [attribute.slug, ...atrybuty],
      sortBy: sort,
    })
  );

  const recipesCount = await db.$count(
    recipeAttributes,
    eq(recipeAttributes.attributeId, attribute.id)
  );

  return (
    <div className="container">
      <RecipesListHero
        heading={attribute.name}
        subheading={`${recipesCount} przepisów w tej diecie`}
        imageUrl="/food.jpg"
      />
      <div className="flex gap-6 items-start">
        <div className="max-w-[350px] w-full">
          <FacetedSearch hideDiets={true} />
        </div>
        <Suspense fallback={<RecipesFeedSkeleton />}>
          <RecipesFeed attributesSlugs={[slug]} />
        </Suspense>
      </div>
    </div>
  );
};

export default CuisinePage;
