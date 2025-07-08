import React from "react";
import { GetRecipe } from "../../types";
import { RecipeHero } from "../sections/recipe-hero";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { CommentsCard } from "@/modules/comments/ui/components/comments-card";
import { IngredientsCard } from "../sections/ingredients-card";
import RecipeLicense from "../sections/recipe-license";
import { PreparationSteps } from "../sections/preparation-steps";

export const RecipeDetailsView = ({ data }: { data: GetRecipe }) => {
  return (
    <div className="space-y-4">
      {!data.published && (
        <Alert>
          <AlertTriangle />
          <AlertTitle>Ten przepis nie jest opublikowany.</AlertTitle>
          <AlertDescription>
            Przepis jest dostępny tylko dla Ciebie i nie będzie widoczny dla
            innych użytkowników. Możesz go opublikować, aby był widoczny
            publicznie.
          </AlertDescription>
        </Alert>
      )}
      <RecipeHero data={data} />
      <div className="flex gap-4 items-start flex-col-reverse lg:flex-row">
        <div className="flex-1 space-y-8">
          <PreparationSteps data={data.preparationSteps} />
          {data.license && <RecipeLicense licence={data.license} />}
          <CommentsCard recipeId={data.id} />
        </div>
        <div className="lg:max-w-[360px] w-full">
          <IngredientsCard ingredients={data.ingredients} />
        </div>
      </div>
    </div>
  );
};
