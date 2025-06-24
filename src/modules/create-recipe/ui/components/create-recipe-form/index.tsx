"use client";

import React from "react";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { FormProvider, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { RecipeFormBasics } from "./basics";
import { RecipeFormIngredients } from "./ingredients";
import {
  createRecipeSchema,
  CreateRecipeSchema,
} from "@/modules/create-recipe/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { RecipeFormSteps } from "./steps";
import { RecipeFormAdditional } from "./additional";

const steps = [
  {
    step: 1,
    title: "Podstawy",
  },
  {
    step: 2,
    title: "Składniki",
  },
  {
    step: 3,
    title: "Kroki przygotowania",
  },
  {
    step: 4,
    title: "Dodatkowe informacje",
  },
];

export const CreateRecipeForm = () => {
  const methods = useForm<CreateRecipeSchema>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: {
      title: "",
      description: "",

      ingredients: [
        {
          ingredient: {
            id: "",
            name: "",
          },
          quantity: 0,
          unit: "",
        },
      ],
      attributes: [],
      steps: [
        {
          description: "",
        },
      ],
    },
  });
  const [currentStep, setCurrentStep] = React.useState(1);

  return (
    <div className="">
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
      <Form {...methods}>
        <FormProvider {...methods}>
          <form>
            {currentStep === 1 && <RecipeFormBasics />}
            {currentStep === 2 && <RecipeFormIngredients />}
            {currentStep === 3 && <RecipeFormSteps />}
            {currentStep === 4 && <RecipeFormAdditional />}
          </form>
        </FormProvider>
      </Form>
    </div>
  );
};
