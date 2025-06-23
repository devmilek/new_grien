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
  const methods = useForm();
  const [currentStep, setCurrentStep] = React.useState(1);

  return (
    <div className="py-10">
      <div className="space-y-8 text-center mb-12">
        <Stepper defaultValue={currentStep} onValueChange={setCurrentStep}>
          {steps.map(({ step, title }) => (
            <StepperItem
              key={step}
              step={step}
              className="not-last:flex-1 max-md:items-start"
            >
              <StepperTrigger className="rounded max-md:flex-col">
                <StepperIndicator />
                <div className="text-center md:text-left">
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
          <form>{currentStep === 1 && <RecipeFormBasics />}</form>
        </FormProvider>
      </Form>
    </div>
  );
};
