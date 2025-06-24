"use client";

import { CreateRecipeSchema } from "@/modules/create-recipe/schemas";
import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { NumberInput } from "./fields/number-input";
import { IngredientInput } from "./fields/ingredient-input";

export const RecipeFormIngredients = () => {
  const form = useFormContext<CreateRecipeSchema>();
  const [newIngredient, setNewIngredient] = useState({
    ingredientId: "",
    quantity: 0,
    unit: "",
    name: "",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const addIngredient = () => {
    if (
      newIngredient.ingredientId &&
      newIngredient.quantity &&
      newIngredient.unit
    ) {
      append({
        ingredientId: newIngredient.ingredientId,
        quantity: newIngredient.quantity,
        unit: newIngredient.unit,
        name: newIngredient.name, // Assuming name is part of the ingredient
      });
      setNewIngredient({
        ingredientId: "",
        quantity: 0,
        unit: "",
        name: "",
      });
    }
  };

  const isAddDisabled =
    !newIngredient.ingredientId ||
    !newIngredient.quantity ||
    !newIngredient.unit;

  return (
    <div className="space-y-6">
      {/* Formularz dodawania nowego składnika */}
      <div className="p-6 bg-background rounded-2xl border">
        <div className="grid grid-cols-12 gap-4 items-end">
          <div className="col-span-5 space-y-2">
            <Label htmlFor="new-ingredient-id">Składnik</Label>
            <IngredientInput
              value={{
                id: newIngredient.ingredientId,
                alias: newIngredient.name,
              }}
              onChange={(value) =>
                setNewIngredient((prev) => ({
                  ...prev,
                  ingredientId: value.id,
                  name: value.alias,
                }))
              }
            />
          </div>

          <div className="col-span-3 space-y-2">
            <Label htmlFor="new-ingredient-quantity">Ilość</Label>
            <NumberInput
              value={newIngredient.quantity}
              onChange={(value) =>
                setNewIngredient((prev) => ({
                  ...prev,
                  quantity: value,
                }))
              }
              step={0.1}
              minValue={0}
            />
          </div>

          <div className="col-span-3 space-y-2">
            <Label htmlFor="new-ingredient-unit">Jednostka</Label>
            <Input
              id="new-ingredient-unit"
              value={newIngredient.unit}
              onChange={(e) =>
                setNewIngredient((prev) => ({ ...prev, unit: e.target.value }))
              }
              placeholder="np. kg, szt, ml"
            />
          </div>

          <div className="col-span-1">
            <Button
              type="button"
              onClick={addIngredient}
              disabled={isAddDisabled}
              size="sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Lista dodanych składników */}
      <div className="p-8 bg-background rounded-2xl border space-y-4">
        {fields.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Brak składników. Wypełnij formularz powyżej i kliknij &quot;+&quot;
            aby dodać składnik.
          </p>
        ) : (
          <>
            <h4 className="font-medium text-sm text-muted-foreground mb-4">
              Dodane składniki ({fields.length})
            </h4>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-6">
                  <div>
                    <span className="font-medium capitalize">{field.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {field.quantity} {field.unit}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
