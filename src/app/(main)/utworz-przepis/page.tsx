import { getCurrentSession } from "@/lib/auth/get-current-session";
import { CreateRecipeForm } from "@/modules/create-recipe/ui/components/create-recipe-form";
import { redirect } from "next/navigation";
import React from "react";

const CreateRecipePage = async () => {
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/logowanie");
  }

  return (
    <div className="container mx-auto">
      <CreateRecipeForm />
    </div>
  );
};

export default CreateRecipePage;
