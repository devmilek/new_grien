import React, { Fragment } from "react";
import { GetRecipe } from "../../types";
import { RecipeHero } from "../sections/recipe-hero";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { CommentsCard } from "@/modules/comments/ui/components/comments-card";

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
      <div className="flex gap-8 items-start">
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
          <CommentsCard recipeId={data.id} />
        </div>
        <div className="w-[360px] p-6 rounded-2xl bg-background border">
          <h2 className="font-display text-2xl">Składniki</h2>
          <div className="mt-4">
            {data.ingredients.map((ingredient) => (
              <Fragment key={ingredient.ingredientAlliasId}>
                <div
                  key={ingredient.ingredientAlliasId}
                  className="flex items-center gap-2"
                >
                  <Checkbox id={ingredient.ingredientAlliasId} />
                  <label
                    htmlFor={ingredient.ingredientAlliasId}
                    className="capitalize text-sm font-medium"
                  >
                    {ingredient.ingredientAlias.alias}{" "}
                    <span className="text-muted-foreground font-normal">
                      ({ingredient.quantity} {ingredient.unit})
                    </span>
                  </label>
                </div>
                {ingredient !==
                  data.ingredients[data.ingredients.length - 1] && (
                  <Separator className="my-2" />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
