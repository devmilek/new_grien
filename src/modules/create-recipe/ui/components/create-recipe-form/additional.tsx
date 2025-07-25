import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn, getRecipeSlug } from "@/lib/utils";
import { useCreateRecipe } from "@/modules/create-recipe/context/create-recipe-context";
import {
  createRecipeSchema,
  CreateRecipeSchema,
} from "@/modules/create-recipe/schemas";
import { uploadImage } from "@/modules/storage/server/upload-image";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

export const RecipeFormAdditional = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const form = useFormContext<CreateRecipeSchema>();
  const { initialData } = useCreateRecipe();

  const { data } = useSuspenseQuery(
    trpc.attributes.getAttributes.queryOptions()
  );

  const createRecipe = useMutation(
    trpc.createRecipe.createRecipe.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const editRecipe = useMutation(
    trpc.createRecipe.editRecipe.mutationOptions({
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
    if (!initialData) {
      if (!values.image) {
        toast.error("Zdjęcie przepisu jest wymagane.");
        return;
      }

      // CREATE MODE
      const formData = new FormData();
      formData.append("image", values.image);
      const { data } = await uploadImage(formData);
      if (!data) {
        toast.error("Nie udało się przesłać obrazu. Spróbuj ponownie.");
        return;
      }
      const { recipeId } = await createRecipe.mutateAsync({
        ...values,
        imageId: data.id,
        published: true,
      });

      toast.success("Przepis został zapisany jako wersja robocza.");
      router.push(`/utworz-przepis/${recipeId}`);
    }
  };
  const saveAndPublish = async (values: CreateRecipeSchema) => {
    if (initialData) {
      // EDIT MODE
      let imageId;

      if (values.image) {
        const formData = new FormData();
        formData.append("image", values.image);
        const { data } = await uploadImage(formData);

        if (!data) {
          toast.error("Nie udało się przesłać obrazu. Spróbuj ponownie.");
          return;
        }
        imageId = data.id;
      }

      await editRecipe.mutateAsync({
        ...values,
        id: initialData.id,
        imageId: imageId || initialData.file?.id,
        published: initialData.published,
      });

      toast.success("Przepis został zapisany.");
      router.refresh();
    } else {
      if (!values.image) {
        toast.error("Zdjęcie przepisu jest wymagane.");
        return;
      }

      // CREATE MODE
      const formData = new FormData();
      formData.append("image", values.image);
      const { data } = await uploadImage(formData);
      if (!data) {
        toast.error("Nie udało się przesłać obrazu. Spróbuj ponownie.");
        return;
      }
      const { recipeId } = await createRecipe.mutateAsync({
        ...values,
        imageId: data.id,
        published: true,
      });

      router.push(`/przepis/${getRecipeSlug(recipeId, values.title)}`);
    }
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
        <div className={cn("flex gap-4")}>
          {!initialData && (
            <Button
              variant="secondary"
              type="button"
              className="flex-1"
              onClick={form.handleSubmit(saveAsDraft, onError)}
            >
              {isSubmitting && <Loader2 className="animate-spin" />}
              Zapisz jako wersję roboczą
            </Button>
          )}
          <Button
            type="button"
            className="flex-1"
            onClick={form.handleSubmit(saveAndPublish, onError)}
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            {initialData ? "Zapisz przepis" : "Utwórz i opublikuj"}
          </Button>
        </div>
      </div>
    </>
  );
};
