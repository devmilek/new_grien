"use client";

import { CreateRecipeSchema } from "@/modules/create-recipe/schemas";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XIcon } from "lucide-react";
import { NumberInput } from "./fields/number-input";
import { IngredientInput } from "./fields/ingredient-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const RecipeFormIngredients = () => {
  const form = useFormContext<CreateRecipeSchema>();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  return (
    <>
      <h1 className="font-display text-2xl lg:text-3xl mb-4">Składniki</h1>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            className="p-4 sm:p-6 bg-background rounded-2xl border relative"
            key={field.id}
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
              <FormField
                name={`ingredients.${index}.ingredient`}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1 sm:flex-[3] sm:min-w-[200px]">
                    <FormLabel>Składnik</FormLabel>
                    <FormControl>
                      <IngredientInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 sm:gap-4 sm:flex-[2] sm:min-w-[200px]">
                <FormField
                  name={`ingredients.${index}.quantity`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1 sm:min-w-[100px]">
                      <FormLabel>Ilość</FormLabel>
                      <FormControl>
                        <NumberInput {...field} step={0.5} minValue={0} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name={`ingredients.${index}.unit`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1 sm:min-w-[100px]">
                      <FormLabel>Jednostka</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="np. kg, szt, ml" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {fields.length > 1 && (
                <div className="flex justify-end sm:justify-center sm:items-end sm:flex-shrink-0">
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    size="icon"
                    variant="ghost"
                    className="mt-2 sm:mt-0"
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          type="button"
          onClick={() => {
            append({
              quantity: 0,
              unit: "",
              ingredient: {
                id: "",
                name: "",
              },
            });
          }}
          className="w-full sm:w-auto"
        >
          Dodaj składnik
        </Button>
      </div>
    </>
  );
};
