import { Category } from "@/db/schema";
import { FacetedSearch } from "@/modules/recipes-filtering/ui/components/faceted-search";
import { RecipesFeed } from "@/modules/recipes-filtering/ui/sections/recipes-feed";
import { RecipesListHero } from "@/modules/recipes-filtering/ui/sections/recipes-list-hero";
import React from "react";

interface CategoryPageProps {
  category: Category;
  recipesCount: number;
}

const CategoryPage = async ({ category, recipesCount }: CategoryPageProps) => {
  return (
    <div className="container">
      <RecipesListHero
        heading={category.name}
        subheading={`${recipesCount} przepisów w tej kategorii`}
        imageUrl={`/kategorie/${category.slug}.jpg`}
      />
      <div className="flex gap-4 items-start mt-4">
        <div className="max-w-[300px] w-full hidden p-6 bg-white rounded-2xl border lg:block">
          <FacetedSearch hideAttribute="categories" />
        </div>
        <RecipesFeed categorySlug={category.slug} />
      </div>
    </div>
  );
};

export default CategoryPage;
