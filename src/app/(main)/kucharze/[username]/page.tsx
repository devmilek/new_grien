import { GeneratedAvatar } from "@/components/generated-avatar";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE } from "@/contstants";
import { db } from "@/db";
import { user as dbUser } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth/get-current-session";
import { loadRecipesSearchParams } from "@/modules/recipes-filtering/params";
import { FacetedSearch } from "@/modules/recipes-filtering/ui/components/faceted-search";
import { RecipesFeed } from "@/modules/recipes-filtering/ui/sections/recipes-feed";
import { prefetch, trpc } from "@/trpc/server";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SearchParams } from "nuqs";
import React from "react";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<SearchParams>;
}

const ProfilePage = async ({ params, searchParams }: ProfilePageProps) => {
  const { user } = await getCurrentSession();
  const { username } = await params;

  const data = await db.query.user.findFirst({
    where: eq(dbUser.username, username),
  });

  if (!data) {
    return notFound();
  }

  const { atrybuty, sort, kategoria } = await loadRecipesSearchParams(
    searchParams
  );

  prefetch(
    trpc.recipesFiltering.getRecipes.infiniteQueryOptions({
      cursor: DEFAULT_PAGE,
      categorySlug: kategoria,
      attributesSlugs: atrybuty,
      sortBy: sort,
      authorId: data.id,
    })
  );

  return (
    <div className="container">
      <div className="bg-white rounded-2xl pb-8 border">
        <div className="h-32 sm:h-48 md:h-58 w-full rounded-2xl overflow-hidden relative border">
          <Image src="/food.jpg" fill alt="Food" className="object-cover" />
        </div>
        <div className="px-4 sm:px-6 lg:px-10 -mt-8 sm:-mt-10 flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
          <GeneratedAvatar
            seed={data?.name}
            className="size-20 sm:size-24 md:size-28 shadow-md"
          />
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl sm:text-2xl truncate">
              {data.name}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              @{data.username}
            </p>
          </div>
          <div className="w-full sm:w-auto">
            {user && user.id === data.id ? (
              <Button variant="outline" className="w-full sm:w-auto">
                Edytuj profil
              </Button>
            ) : (
              <Button className="w-full sm:w-auto">Obserwuj</Button>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-4 items-start mt-4">
        <div className="max-w-[300px] w-full hidden p-6 bg-white rounded-2xl border lg:block">
          <FacetedSearch />
        </div>
        <RecipesFeed authorId={data.id} />
      </div>
    </div>
  );
};

export default ProfilePage;
