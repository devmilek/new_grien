import { GeneratedAvatar } from "@/components/generated-avatar";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE } from "@/contstants";
import { db } from "@/db";
import { user as dbUser, User } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth/get-current-session";
import { getIdFromSlug, getUserSlug } from "@/lib/utils";
import EditProfileDialog from "@/modules/account/ui/components/edit-profile-dialog";
import { loadRecipesSearchParams } from "@/modules/recipes-filtering/params";
import { FacetedSearch } from "@/modules/recipes-filtering/ui/components/faceted-search";
import { RecipesFeed } from "@/modules/recipes-filtering/ui/sections/recipes-feed";
import { prefetch, trpc } from "@/trpc/server";
import { eq } from "drizzle-orm";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import Image from "next/image";
import { notFound, redirect, RedirectType } from "next/navigation";
import { SearchParams } from "nuqs";
import React from "react";

interface ProfilePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

const getUserById = async (id: string) => {
  const user = await db.query.user.findFirst({
    where: eq(dbUser.id, id),
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const ProfilePage = async ({ params, searchParams }: ProfilePageProps) => {
  const { session } = await getCurrentSession();
  const { slug } = await params;

  const id = getIdFromSlug(slug);

  if (!id) {
    return notFound();
  }

  let user: User;

  try {
    user = await getUserById(id);
    const correctSlug = getUserSlug(user.id, user.username);

    if (!user) {
      return notFound();
    }

    if (correctSlug !== slug) {
      const redirectUrl = `/kucharze/${correctSlug}`;
      redirect(redirectUrl, RedirectType.replace);
    }
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }
    notFound();
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
      authorId: user.id,
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
            seed={user.name}
            className="size-20 sm:size-24 md:size-28 shadow-md"
          />
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl sm:text-2xl truncate">
              {user.name}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              @{user.username}
            </p>
          </div>
          <div className="w-full sm:w-auto">
            {session?.userId && user.id === session.userId ? (
              <EditProfileDialog />
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
        <RecipesFeed authorId={user.id} />
      </div>
    </div>
  );
};

export default ProfilePage;
