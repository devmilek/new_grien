import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { categories, recipes } from "@/db/schema";
import { getRecipeSlug, getS3Url } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import { desc, eq } from "drizzle-orm";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const SmallCategorySection = async () => {
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, "napoje"),
  });

  if (!category) {
    return null;
  }

  const data = await db.query.recipes.findMany({
    where: eq(recipes.categoryId, category.id),
    with: {
      file: true,
      category: true,
      author: true,
    },
    limit: 5,
    orderBy: desc(recipes.createdAt),
  });
  return (
    <section className="space-y-6 p-6 rounded-2xl bg-background border">
      <header className="flex items-center justify-between">
        <h2 className="font-display text-xl">{category.name}</h2>
        <Button asChild size="sm" variant="ghost">
          <Link href={`/kategorie/${category.slug}`}>
            Zobacz wszystkie <ChevronRight />
          </Link>
        </Button>
      </header>
      <div className="grid gap-4">
        {data.map((recipe) => (
          <Link
            href={`/przepisy/${getRecipeSlug(recipe.id, recipe.title)}`}
            key={recipe.id}
            className="flex items-center gap-4 group"
          >
            <div className="relative w-20 h-20 overflow-hidden rounded-xl shrink-0">
              <Image
                width={80}
                height={80}
                alt={recipe.title}
                src={getS3Url(recipe.file.key)}
                className="size-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <h3 className="font-display text-lg group-hover:underline">
                {recipe.title}
              </h3>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <span className="text-primary font-semibold text-sm">
                    {recipe.author.name}
                  </span>
                </div>
                <span className="mx-1 text-muted-foreground">•</span>
                <time dateTime={recipe.createdAt.toISOString()}>
                  {formatDistanceToNow(recipe.createdAt, {
                    addSuffix: true,
                    locale: pl,
                  })}
                </time>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
