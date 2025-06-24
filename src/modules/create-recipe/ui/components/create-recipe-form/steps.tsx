import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RecipeSchema } from "@/modules/create-recipe/schemas";
import { XIcon } from "lucide-react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

export const RecipeFormSteps = () => {
  const form = useFormContext<RecipeSchema>();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "steps",
  });

  return (
    <>
      <h1 className="font-display text-2xl lg:text-3xl mb-4">
        Kroki przygotowania
      </h1>

      <div className="space-y-4">
        {fields.map((field, index) => {
          return (
            <div
              className="p-4 sm:p-6 bg-background rounded-2xl border relative"
              key={field.id}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                <FormField
                  name={`steps.${index}.description`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1 sm:flex-[3] sm:min-w-[200px]">
                      <FormLabel>Treść kroku {index + 1}</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
          );
        })}
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            append({
              description: "",
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
