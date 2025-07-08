"use client";

import React from "react";
import { FacetedSearch } from "@/modules/recipes-filtering/ui/components/faceted-search";
import { RecipesFeed } from "@/modules/recipes-filtering/ui/sections/recipes-feed";
import { User } from "better-auth";
import { User as DbUser } from "@/db/schema";
import { UserDetailsHero } from "../sections/user-details-hero";

export const UserDetailsView = ({
  user,
  currentUser,
}: {
  user: DbUser;
  currentUser: User | null;
}) => {
  return (
    <div className="container">
      <UserDetailsHero currentUser={currentUser} user={user} />
      <div className="flex gap-4 items-start mt-4">
        <div className="max-w-[300px] w-full hidden p-6 bg-white rounded-2xl border lg:block">
          <FacetedSearch />
        </div>
        <RecipesFeed authorId={user.id} />
      </div>
    </div>
  );
};
