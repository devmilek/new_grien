"use client";

import React, { useEffect } from "react";
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
import { GetRecipe } from "@/modules/create-recipe/types";
import {
  CreateRecipeProvider,
  useCreateRecipe,
} from "@/modules/create-recipe/context/create-recipe-context";
import { RecipeFormStepper } from "./stepper";

interface CreateRecipeFormProps {
  initialData?: GetRecipe;
}

const CreateRecipeFormContent = ({ initialData }: CreateRecipeFormProps) => {
  const methods = useForm<CreateRecipeSchema>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      difficulty: initialData?.difficulty || undefined,
      portions: initialData?.portions || undefined,
      preparationTime: initialData?.preparationTime || undefined,
      categoryId: initialData?.category?.id || undefined,

      ingredients: initialData?.ingredients.map((ingredient) => ({
        ingredient: {
          id: ingredient.ingredientAlias.id,
          name: ingredient.ingredientAlias.alias,
        },
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      })) || [
        {
          ingredient: { id: "", name: "" },
          quantity: 0,
          unit: "",
        },
      ],
      attributes:
        initialData?.attributes.map((attribute) => attribute.attributeId) || [],
      steps: initialData?.preparationSteps.map((step) => ({
        description: step.description,
        image: step.fileId || undefined,
      })) || [
        {
          description: "",
          image: undefined,
        },
      ],
    },
  });

  const { currentStep, setInitialImage } = useCreateRecipe();

  useEffect(() => {
    if (initialData?.file) {
      setInitialImage(initialData?.file);
    } else {
      setInitialImage(null);
    }
  }, [initialData, setInitialImage]);

  return (
    <>
      <RecipeFormStepper />
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
    </>
  );
};

export const CreateRecipeForm = ({ initialData }: CreateRecipeFormProps) => {
  return (
    <CreateRecipeProvider>
      <CreateRecipeFormContent initialData={initialData} />
    </CreateRecipeProvider>
  );
};
