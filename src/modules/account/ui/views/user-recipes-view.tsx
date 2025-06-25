import React, { Suspense } from "react";
import {
  UserRecipesStats,
  UserRecipesStatsSkeleton,
} from "../sections/user-recipes-stats";
import { UserRecipesList } from "../sections/user-recipes-list";

export const UserRecipesView = () => {
  return (
    <div className="space-y-10">
      <Suspense fallback={<UserRecipesStatsSkeleton />}>
        <UserRecipesStats />
      </Suspense>
      <UserRecipesList />
    </div>
  );
};
