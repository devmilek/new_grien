import { getAttribute } from "@/app/(main)/(attributes)/utils";
import { DEFAULT_PAGE } from "@/contstants";
import { db } from "@/db";
import { Attribute, recipeAttributes } from "@/db/schema";
import { pluralizeRecipes } from "@/lib/pluralize";
import { loadRecipesSearchParams } from "@/modules/recipes-filtering/params";
import { FacetedSearch } from "@/modules/recipes-filtering/ui/components/faceted-search";
import { RecipesFeed } from "@/modules/recipes-filtering/ui/sections/recipes-feed";
import { RecipesListHero } from "@/modules/recipes-filtering/ui/sections/recipes-list-hero";
import { prefetch, trpc } from "@/trpc/server";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { SearchParams } from "nuqs";
import React from "react";

interface AttributePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
  attributeType: Attribute["type"];
}
const subheadingMap: Record<Attribute["type"], string> = {
  diets: "w tej diecie",
  cuisines: "w tej kuchni",
  occasions: "na tę okazję",
};

const AttributePage = async ({
  params,
  searchParams,
  attributeType,
}: AttributePageProps) => {
  const { slug } = await params;
  const attribute = await getAttribute(slug);

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
    <div className="container space-y-4">
      <RecipesListHero
        heading={attribute.name}
        subheading={`${pluralizeRecipes(recipesCount)} ${
          subheadingMap[attributeType]
        }`}
        imageUrl="/food.jpg"
      />
      <div className="flex gap-4 items-start">
        <div className="max-w-[300px] w-full hidden p-6 bg-white rounded-2xl border lg:block">
          <FacetedSearch hideAttribute={attributeType} />
        </div>
        <RecipesFeed attributesSlugs={[slug]} />
      </div>
    </div>
  );
};

export default AttributePage;
