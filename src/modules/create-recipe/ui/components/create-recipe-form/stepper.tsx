import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { useCreateRecipe } from "@/modules/create-recipe/context/create-recipe-context";
import React from "react";

export const RecipeFormStepper = () => {
  const { currentStep, setCurrentStep, steps } = useCreateRecipe();

  return (
    <div className="space-y-8 text-center mb-6 md:mb-12">
      <Stepper
        defaultValue={currentStep}
        onValueChange={setCurrentStep}
        className="p-8 rounded-2xl bg-background border"
      >
        {steps.map(({ step, title }) => (
          <StepperItem
            key={step}
            step={step}
            className="not-last:flex-1 max-md:items-start"
          >
            <StepperTrigger className="rounded max-md:flex-col">
              <StepperIndicator />
              <div className="text-center md:text-left hidden sm:block">
                <StepperTitle>{title}</StepperTitle>
              </div>
            </StepperTrigger>
            {step < steps.length && (
              <StepperSeparator className="max-md:mt-3.5 md:mx-4" />
            )}
          </StepperItem>
        ))}
      </Stepper>
    </div>
  );
};
