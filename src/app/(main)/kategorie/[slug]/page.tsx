import { DEFAULT_PAGE } from "@/contstants";
import { db } from "@/db";
import { categories, recipes } from "@/db/schema";
import { constructMetadata } from "@/lib/construct-metadata";
import CategoryPage from "@/modules/attributes/ui/views/category-view";
import { loadRecipesSearchParams } from "@/modules/recipes-filtering/params";
import { prefetch, trpc } from "@/trpc/server";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { SearchParams } from "nuqs";
import { cache } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

const getCategory = cache(async (slug: string) => {
  return await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });
});

export const generateMetadata = async ({ params }: PageProps) => {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return constructMetadata({
      title: "Kategoria nie znaleziona",
      description: "Kategoria, której szukasz, nie została znaleziona.",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: category.name,
    description: category.description,
    image: `/${category.slug}.jpg`,
    url: `/kategorie/${category.slug}`,
    canonicalUrl: `/kategorie/${category.slug}`,
  });
};

const CategorySlugPage = async ({ params, searchParams }: PageProps) => {
  const { slug } = await params;
  const category = await getCategory(slug);

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

  return <CategoryPage category={category} recipesCount={recipesCount} />;
};

export default CategorySlugPage;
