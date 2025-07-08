import React, { Fragment } from "react";
import { GetRecipe } from "../../types";
import { RecipeHero } from "../sections/recipe-hero";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CommentsCard } from "@/modules/comments/ui/components/comments-card";
import { IngredientsCard } from "../sections/ingredients-card";
import RecipeLicense from "../sections/recipe-license";

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
      <div className="flex gap-4 items-start">
        <div className="@container flex-1 space-y-8">
          <div className="p-6 rounded-2xl bg-background border">
            {data.preparationSteps.map((step, index) => (
              <Fragment key={step.id}>
                <div>
                  <h3 className="font-display text-2xl">Krok {index + 1}</h3>
                  <p className="mt-2 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {index < data.preparationSteps.length - 1 && (
                  <Separator className="my-5" />
                )}
              </Fragment>
            ))}
          </div>
          {data.license && <RecipeLicense licence={data.license} />}
          <CommentsCard recipeId={data.id} />
        </div>
        <div className="max-w-[360px] w-full">
          <IngredientsCard ingredients={data.ingredients} />
        </div>
      </div>
    </div>
  );
};
