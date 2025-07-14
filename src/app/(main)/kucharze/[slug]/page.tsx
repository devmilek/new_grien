import { DEFAULT_PAGE } from "@/contstants";
import { db } from "@/db";
import { users as dbUsers, User } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth/get-current-session";
import { constructMetadata } from "@/lib/construct-metadata";
import { getIdFromSlug, getUserSlug } from "@/lib/utils";
import { UserDetailsView } from "@/modules/account/ui/views/user-details-view";
import { loadRecipesSearchParams } from "@/modules/recipes-filtering/params";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { eq } from "drizzle-orm";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { notFound, redirect, RedirectType } from "next/navigation";
import { SearchParams } from "nuqs";
import React, { cache } from "react";

interface ProfilePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

const getUserById = cache(async (id: string) => {
  const user = await db.query.users.findFirst({
    where: eq(dbUsers.id, id),
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
});

export const generateMetadata = async ({ params }: ProfilePageProps) => {
  const { slug } = await params;

  const id = getIdFromSlug(slug);

  if (!id) {
    return constructMetadata({
      title: "Użytkownik nie znaleziony",
      description: "Nie udało się znaleźć profilu użytkownika.",
      noIndex: true,
    });
  }

  let user: User;

  try {
    user = await getUserById(id);
  } catch {
    return constructMetadata({
      title: "Użytkownik nie znaleziony",
      description: "Nie udało się znaleźć profilu użytkownika.",
      noIndex: true,
    });
  }

  const correctSlug = getUserSlug(user.id, user.username);

  return constructMetadata({
    title: `${user.name} @${user.username} - Profil kucharza`,
    description: `Odkryj przepisy kulinarne od ${user.name} na Grien. Sprawdź ulubione przepisy i inspiruj się kuchnią tego użytkownika.`,
    url: `/kucharze/${correctSlug}`,
    canonicalUrl: `/kucharze/${correctSlug}`,
  });
};

const ProfilePage = async ({ params, searchParams }: ProfilePageProps) => {
  const session = await getCurrentSession();
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

  const { atrybuty, sort, kategoria } =
    await loadRecipesSearchParams(searchParams);

  prefetch(
    trpc.recipesFiltering.getRecipes.infiniteQueryOptions({
      cursor: DEFAULT_PAGE,
      categorySlug: kategoria,
      attributesSlugs: atrybuty,
      sortBy: sort,
      authorId: user.id,
    })
  );

  prefetch(
    trpc.account.getFollowStats.queryOptions({
      userId: user.id,
    })
  );

  return (
    <HydrateClient>
      <UserDetailsView user={user} currentUser={session.user} />
    </HydrateClient>
  );
};

export default ProfilePage;
