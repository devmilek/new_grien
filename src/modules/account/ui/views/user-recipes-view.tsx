import React from "react";
import { UserRecipesStats } from "../sections/user-recipes-stats";
import { UserRecipesList } from "../sections/user-recipes-list";

export const UserRecipesView = () => {
  return (
    <div className="space-y-10">
      <UserRecipesStats />
      <UserRecipesList />
    </div>
  );
};
