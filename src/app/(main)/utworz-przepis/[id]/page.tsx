import { getCurrentSession } from "@/lib/auth/get-current-session";
import { CreateRecipeForm } from "@/modules/create-recipe/ui/components/create-recipe-form";
import { caller } from "@/trpc/server";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface EditRecipePageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditRecipePage = async ({ params }: EditRecipePageProps) => {
  const { user } = await getCurrentSession();
  const { id } = await params;

  if (!user) {
    redirect("/logowanie");
  }

  const data = await caller.createRecipe.getRecipe({
    id,
  });

  if (!data) {
    notFound();
  }

  return (
    <div className="container mx-auto">
      <CreateRecipeForm initialData={data} />
    </div>
  );
};

export default EditRecipePage;
