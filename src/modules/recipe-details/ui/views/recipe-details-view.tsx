import React from "react";
import { GetRecipe } from "../../types";
import { RecipeHero } from "../sections/recipe-hero";

export const RecipeDetailsView = ({ data }: { data: GetRecipe }) => {
  return (
    <div>
      <RecipeHero data={data} />
    </div>
  );
};
