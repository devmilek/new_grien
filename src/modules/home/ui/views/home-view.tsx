import React from "react";
import { CategorySection } from "../sections/category-section";
import QuoteSection from "../sections/quote-section";
import { CategoriesSection } from "../sections/categories-section";
import { SmallCategorySection } from "../sections/small-category-section";
import { LatestRecipesSection } from "../sections/latest-recipes-section";
import { FeaturedSection } from "../sections/featured-section";

export const HomeView = () => {
  return (
    <div>
      <FeaturedSection />
      <div className="flex gap-6 mt-8 flex-col-reverse lg:flex-row">
        <div className="flex-1 space-y-6">
          <CategorySection />
          <LatestRecipesSection />
        </div>
        <div className="lg:w-[380px] space-y-4">
          <QuoteSection />
          <SmallCategorySection />
          <CategoriesSection />
        </div>
      </div>
    </div>
  );
};
