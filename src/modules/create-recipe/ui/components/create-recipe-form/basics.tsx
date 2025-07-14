import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateRecipeSchema } from "@/modules/create-recipe/schemas";
import React from "react";
import { useFormContext } from "react-hook-form";
import { CategorySelect } from "./fields/category-select";
import { DifficultySelect } from "./fields/difficulty-select";
import { NumberInput } from "./fields/number-input";
import { TimeInput } from "./fields/time-input";
import Dropzone from "@/modules/storage/ui/components/dropzone";

export const RecipeFormBasics = () => {
  const form = useFormContext<CreateRecipeSchema>();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-2xl lg:text-3xl mb-4">
        Podstawy przepisu
      </h1>
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
                <Textarea {...field} maxLength={500} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="image"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zdjęcie przepisu</FormLabel>
              <FormControl>
                <Dropzone value={field.value} onValueChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 md:grid-cols-2">
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
                <FormLabel>Poziom trudności</FormLabel>
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
                <FormLabel>Czas przygotowania</FormLabel>
                <FormControl>
                  <TimeInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};
