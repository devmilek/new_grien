import React from "react";
import { CategorySection } from "../sections/category-section";
import QuoteSection from "../sections/quote-section";
import { CategoriesSection } from "../sections/categories-section";
import { SmallCategorySection } from "../sections/small-category-section";

export const HomeView = () => {
  return (
    <div>
      <div className="flex gap-6">
        <div className="flex-1">
          <CategorySection />
        </div>
        <div className="w-[380px] space-y-4">
          <QuoteSection />
          <SmallCategorySection />
          <CategoriesSection />
        </div>
      </div>
    </div>
  );
};
