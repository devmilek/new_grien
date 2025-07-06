import { DEFAULT_PAGE } from "@/contstants";
import { db } from "@/db";
import { attributes, recipeAttributes, TAttribute } from "@/db/schema";
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

interface AttributePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
  attributeType: TAttribute["type"];
}

const subheadingMap: Record<TAttribute["type"], string> = {
  diets: "przepisów w tej diecie",
  cuisines: "przepisów w tej kuchni",
  occasions: "przepisów na tę okazję",
  categories: "przepisów w tej kategorii",
};

const AttributePage = async ({
  params,
  searchParams,
  attributeType,
}: AttributePageProps) => {
  const { slug } = await params;
  const attribute = await db.query.attributes.findFirst({
    where: eq(attributes.slug, slug),
  });

  if (!attribute || attribute.type !== attributeType) {
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
        subheading={`${recipesCount} ${subheadingMap[attributeType]}`}
        imageUrl="/food.jpg"
      />
      <div className="flex gap-6 items-start">
        <div className="max-w-[350px] w-full">
          <FacetedSearch hideAttribute={attributeType} />
        </div>
        <Suspense fallback={<RecipesFeedSkeleton />}>
          <RecipesFeed attributesSlugs={[slug]} />
        </Suspense>
      </div>
    </div>
  );
};

export default AttributePage;