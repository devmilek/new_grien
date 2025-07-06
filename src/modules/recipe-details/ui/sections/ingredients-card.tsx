import React, { Fragment } from "react";
import { GetRecipe } from "../../types";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

const decimalToFraction = (decimal: number): string => {
  // Jeśli to liczba całkowita, zwróć jako string
  if (decimal === Math.floor(decimal)) {
    return decimal.toString();
  }

  // Mapa popularnych ułamków
  const fractionMap: { [key: string]: string } = {
    "0.25": "1/4",
    "0.33": "1/3",
    "0.5": "1/2",
    "0.67": "2/3",
    "0.75": "3/4",
    "0.125": "1/8",
    "0.375": "3/8",
    "0.625": "5/8",
    "0.875": "7/8",
    "0.17": "1/6",
    "0.83": "5/6",
    "0.2": "1/5",
    "0.4": "2/5",
    "0.6": "3/5",
    "0.8": "4/5",
  };

  // Sprawdź czy decimal pasuje do któregoś z popularnych ułamków
  const decimalStr = decimal.toFixed(2);
  if (fractionMap[decimalStr]) {
    return fractionMap[decimalStr];
  }

  // Dla liczb z częścią całkowitą (np. 1.5 = 1 1/2)
  if (decimal > 1) {
    const wholePart = Math.floor(decimal);
    const fractionalPart = decimal - wholePart;
    const fractionalStr = fractionalPart.toFixed(2);

    if (fractionMap[fractionalStr]) {
      return `${wholePart} ${fractionMap[fractionalStr]}`;
    }
  }

  // Jeśli nie ma dopasowania, zwróć oryginalną liczbę
  return decimal.toString();
};

export const IngredientsCard = ({
  ingredients,
}: {
  ingredients: GetRecipe["ingredients"];
}) => {
  return (
    <div className="p-6 rounded-2xl bg-background border">
      <h2 className="font-display text-2xl">Składniki</h2>
      <div className="mt-4">
        {ingredients.map((ingredient, index) => (
          <Fragment key={ingredient.ingredientAlliasId}>
            <div className="flex items-center gap-2">
              <Checkbox id={ingredient.ingredientAlliasId} />
              <label
                htmlFor={ingredient.ingredientAlliasId}
                className="capitalize text-sm font-medium cursor-pointer"
              >
                {ingredient.ingredientAlias.alias}{" "}
                <span className="text-muted-foreground font-normal">
                  ({decimalToFraction(ingredient.quantity)} {ingredient.unit})
                </span>
              </label>
            </div>
            {index < ingredients.length - 1 && <Separator className="my-3" />}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
