import { getCurrentSession } from "@/lib/auth/get-current-session";
import { constructMetadata } from "@/lib/construct-metadata";
import { formatTime } from "@/lib/formatters";
import { pluralizePortions } from "@/lib/pluralize";
import { getIdFromSlug, getRecipeSlug, getS3Url } from "@/lib/utils";
import { GetRecipe } from "@/modules/recipe-details/types";
import { RecipeDetailsView } from "@/modules/recipe-details/ui/views/recipe-details-view";
import { caller } from "@/trpc/server";
import { Metadata } from "next";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { notFound, redirect, RedirectType } from "next/navigation";
import React, { cache } from "react";
import type { Recipe, WithContext } from "schema-dts";

interface RecipePageProps {
  params: Promise<{ slug: string }>;
}

const getRecipe = cache(async (id: string) => {
  const recipe = await caller.recipeDetails.getRecipe(id);
  return recipe;
});

export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  const id = getIdFromSlug(slug);

  if (!id) {
    return constructMetadata({
      title: "Przepis nie znaleziony",
      description: "Przepis, którego szukasz, nie został znaleziony.",
      noIndex: true, // ✅ Dodaj noIndex dla 404
    });
  }

  try {
    const recipe = await getRecipe(id);

    if (!recipe) {
      return constructMetadata({
        title: "Przepis nie znaleziony",
        description: "Przepis, którego szukasz, nie został znaleziony.",
        noIndex: true,
      });
    }

    const description = recipe.description
      ? `${recipe.description.slice(0, 155)}${
          recipe.description.length > 155 ? "..." : ""
        }`
      : `Sprawdź przepis na ${recipe.title}. Czas przygotowania: ${recipe.preparationTime} min, porcje: ${recipe.portions}.`;

    const correctSlug = getRecipeSlug(recipe.id, recipe.title);

    return constructMetadata({
      title: recipe.title,
      description,
      image: getS3Url(recipe.file.key),
      url: `/przepisy/${correctSlug}`,
      canonicalUrl: `/przepisy/${correctSlug}`,
      noIndex: !recipe.published,
    });
  } catch (error) {
    console.error("Error generating metadata for recipe:", error);
    return constructMetadata({
      title: "Przepis nie znaleziony",
      description: "Przepis, którego szukasz, nie został znaleziony.",
      noIndex: true,
    });
  }
}

const RecipePage = async ({ params }: RecipePageProps) => {
  const { user } = await getCurrentSession();
  const { slug } = await params;

  const id = getIdFromSlug(slug);

  if (!id) {
    notFound();
  }

  let recipe: GetRecipe;

  try {
    recipe = await getRecipe(id);

    if (!recipe) {
      notFound();
    }

    if (!recipe.published && (!user || user.id !== recipe.authorId)) {
      notFound();
    }

    const correctSlug = getRecipeSlug(recipe.id, recipe.title);

    if (correctSlug !== slug) {
      const redirectUrl = `/przepisy/${correctSlug}`;
      redirect(redirectUrl, RedirectType.replace);
    }
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }
    console.error("Error fetching recipe:", e);
    notFound();
  }

  const jsonLd: WithContext<Recipe> = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description || "",
    image: getS3Url(recipe.file.key),
    prepTime: formatTime(recipe.preparationTime),
    recipeYield: pluralizePortions(recipe.portions),
    recipeCategory: recipe.category.name,
    recipeCuisine: recipe.attributes
      .filter((attr) => attr.attribute.type === "cuisines")
      .map((attr) => attr.attribute.name)
      .join(", "),
    step: recipe.preparationSteps.map((step, index) => ({
      "@type": "HowToStep",
      text: step.description,
      position: index + 1,
    })),
    recipeIngredient: recipe.ingredients.map((ingredient) => {
      const alias = ingredient.ingredientAlias?.alias;
      return `${ingredient.quantity} ${ingredient.unit} ${alias}`;
    }),
  };

  return (
    <div className="container">
      <RecipeDetailsView data={recipe} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
};

export default RecipePage;
