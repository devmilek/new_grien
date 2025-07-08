import React, { Fragment } from "react";
import { GetRecipe } from "../../types";
import { Separator } from "@/components/ui/separator";

export const PreparationSteps = ({
  data,
}: {
  data: GetRecipe["preparationSteps"];
}) => {
  return (
    <div className="p-6 rounded-2xl bg-background border">
      {data.map((step, index) => (
        <Fragment key={step.id}>
          <div>
            <h3 className="font-display text-2xl">Krok {index + 1}</h3>
            <p className="mt-2 text-muted-foreground">{step.description}</p>
          </div>
          {index < data.length - 1 && <Separator className="my-5" />}
        </Fragment>
      ))}
    </div>
  );
};
