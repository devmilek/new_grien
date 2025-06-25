import { DEFAULT_PAGE } from "@/contstants";
import { getCurrentSession } from "@/lib/auth/get-current-session";
import { UserRecipesView } from "@/modules/account/ui/views/user-recipes-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { redirect } from "next/navigation";
import React from "react";

const UserRecipesPage = async () => {
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/logowanie");
  }

  prefetch(trpc.account.getRecipesStats.queryOptions());
  prefetch(
    trpc.account.getUserRecipes.infiniteQueryOptions({
      cursor: DEFAULT_PAGE,
    })
  );

  return (
    <div className="container">
      <HydrateClient>
        <UserRecipesView />
      </HydrateClient>
    </div>
  );
};

export default UserRecipesPage;
