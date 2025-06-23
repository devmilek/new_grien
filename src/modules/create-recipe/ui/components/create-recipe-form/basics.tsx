import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { CreateRecipeSchema } from "@/modules/create-recipe/schemas";
import React from "react";
import { useFormContext } from "react-hook-form";
import { CategorySelect } from "./fields/category-select";
import { DifficultySelect } from "./fields/difficulty-select";
import { NumberInput } from "./fields/number-input";
import { TimeInput } from "./fields/time-input";

export const RecipeFormBasics = () => {
  const form = useFormContext<CreateRecipeSchema>();

  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({ maxLength: 500 });

  return (
    <div className="p-8 rounded-2xl bg-background border grid gap-4 max-w-3xl mx-auto">
      <FormField
        name="title"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tytuł przepisu</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
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
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid gap-4 grid-cols-2">
        <FormField
          name="categoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategoria</FormLabel>
              <FormControl>
                <CategorySelect {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="difficulty"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategoria</FormLabel>
              <FormControl>
                <DifficultySelect {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="portions"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Liczba porcji</FormLabel>
              <FormControl>
                <NumberInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="preparationTime"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Liczba porcji</FormLabel>
              <FormControl>
                <TimeInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
