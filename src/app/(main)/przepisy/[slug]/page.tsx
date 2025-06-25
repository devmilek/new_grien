import { getCurrentSession } from "@/lib/auth/get-current-session";
import { GetRecipe } from "@/modules/recipe-details/types";
import { RecipeDetailsView } from "@/modules/recipe-details/ui/views/recipe-details-view";
import { caller } from "@/trpc/server";
import slugify from "@sindresorhus/slugify";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { notFound, redirect, RedirectType } from "next/navigation";
import React from "react";

interface RecipePageProps {
  params: Promise<{ slug: string }>;
}

const getIdFromSlug = (slug: string): string | null => {
  const match = slug.match(/-([a-zA-Z0-9]{10,})$/);
  return match ? match[1] : null;
};

const getRecipeSlug = (id: string, title: string) => {
  return `${slugify(title)}-${id}`;
};

const RecipePage = async ({ params }: RecipePageProps) => {
  const { user } = await getCurrentSession();
  const { slug } = await params;

  const id = getIdFromSlug(slug);

  if (!id) {
    notFound();
  }

  let recipe: GetRecipe;

  try {
    recipe = await caller.recipeDetails.getRecipe(id);

    if (!recipe) {
      notFound();
    }

    if (user?.id !== recipe.authorId) {
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

  return (
    <div className="container">
      <RecipeDetailsView data={recipe} />
    </div>
  );
};

export default RecipePage;
