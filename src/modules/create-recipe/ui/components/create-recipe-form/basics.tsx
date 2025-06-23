import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { CreateRecipeSchema } from "@/modules/create-recipe/schemas";
import React from "react";
import { useFormContext } from "react-hook-form";

export const RecipeFormBasics = () => {
  const form = useFormContext<CreateRecipeSchema>();

  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({ maxLength: 500 });

  return (
    <div className="p-8 rounded-2xl bg-background border grid gap-4">
      <FormField
        name="title"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tytuł przepisu</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        name="description"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Opis przepisu</FormLabel>
            <FormControl>
              <Textarea
                value={value}
                maxLength={limit}
                onChange={(e) => {
                  handleChange(e);
                  field.onChange(e);
                }}
                aria-describedby={`${field.name}-description`}
              />
            </FormControl>
            <p
              className="text-muted-foreground mt-2 text-right text-xs"
              role="status"
              aria-live="polite"
            >
              <span className="tabular-nums">{limit - characterCount}</span>{" "}
              characters left
            </p>
          </FormItem>
        )}
      />
    </div>
  );
};
