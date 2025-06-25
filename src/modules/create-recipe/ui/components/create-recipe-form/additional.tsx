import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  createRecipeSchema,
  CreateRecipeSchema,
} from "@/modules/create-recipe/schemas";
import { uploadImage } from "@/modules/storage/server/upload-image";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

export const RecipeFormAdditional = () => {
  const trpc = useTRPC();
  const form = useFormContext<CreateRecipeSchema>();

  const { data } = useSuspenseQuery(
    trpc.attributes.getAttributes.queryOptions()
  );

  const { mutateAsync } = useMutation(
    trpc.createRecipe.createRecipe.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const onError = () => {
    const values = form.getValues();

    const validates = createRecipeSchema.safeParse(values);

    if (!validates.success) {
      const issues = validates.error.issues.map((issue) => issue.message);

      if (issues.length > 5) {
        toast.error(
          "Formularz zawiera błędy. Sprawdź pola i spróbuj ponownie.",
          {
            description: () => (
              <ul className="list-disc list-inside">
                {issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            ),
          }
        );
      } else {
        issues.map((issue) => {
          toast.error(issue);
        });
      }
    }
  };

  const saveAsDraft = async (values: CreateRecipeSchema) => {
    const formData = new FormData();
    formData.append("image", values.image);
    const { data } = await uploadImage(formData);

    if (!data) {
      toast.error("Nie udało się przesłać obrazu. Spróbuj ponownie.");
      return;
    }

    await mutateAsync({
      ...values,
      imageId: data.id,
      published: false,
    });
  };

  const saveAndPublish = async (values: CreateRecipeSchema) => {
    const formData = new FormData();
    formData.append("image", values.image);
    const { data } = await uploadImage(formData);

    if (!data) {
      toast.error("Nie udało się przesłać obrazu. Spróbuj ponownie.");
      return;
    }

    await mutateAsync({
      ...values,
      imageId: data.id,
      published: true,
    });
  };

  const attributesList = [
    {
      label: "Kuchnie świata",
      items: data.cuisines,
    },
    {
      label: "Okazje",
      items: data.occasions,
    },
    {
      label: "Diety",
      items: data.diets,
    },
  ];

  const selectedAttributes = form.watch("attributes") || [];

  const isSubmitting = form.formState.isSubmitting;

  return (
    <>
      <h1 className="font-display text-2xl lg:text-3xl mb-4">
        Dodatkowe informacje
      </h1>
      <div className="p-6 bg-white rounded-2xl border space-y-10">
        {attributesList.map((section, index) => (
          <div className="space-y-4" key={index}>
            <h3 className="text-xl font-display">{section.label}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
              {section.items.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox
                    id={item.id}
                    checked={selectedAttributes.includes(item.id)}
                    onCheckedChange={() => {
                      const currentAttributes =
                        form.getValues("attributes") || [];
                      const newAttributes = currentAttributes.includes(item.id)
                        ? currentAttributes.filter((id) => id !== item.id)
                        : [...currentAttributes, item.id];

                      form.setValue("attributes", newAttributes);
                    }}
                  />
                  <Label htmlFor={item.id} className="cursor-pointer">
                    {item.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="secondary"
            type="button"
            onClick={form.handleSubmit(saveAsDraft, onError)}
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            Zapisz jako wersję roboczą
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit(saveAndPublish, onError)}
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            Opublikuj przepis
          </Button>
        </div>
      </div>
    </>
  );
};
