import { GeneratedAvatar } from "@/components/generated-avatar";
import { db } from "@/db";
import { recipes } from "@/db/schema";
import { cn, getRecipeSlug, getS3Url } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import { desc, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const FeaturedSection = async () => {
  const data = await db.query.recipes.findMany({
    where: eq(recipes.published, true),
    with: {
      file: true,
      category: true,
      author: true,
    },
    limit: 3,
    orderBy: desc(recipes.createdAt),
  });
  return (
    <section className="space-y-6">
      <div className="flex gap-3">
        {data.map((recipe) => (
          <Link
            href={`/przepisy/${getRecipeSlug(recipe.id, recipe.title)}`}
            key={recipe.id}
            className={cn(
              "relative h-[460px] overflow-hidden rounded-2xl group flex-2 hover:flex-3 transition-all",
              {}
            )}
          >
            <div className="z-20 relative p-6 from-black/60 to-black/0 bg-linear-to-t size-full flex flex-col justify-end">
              <p className="text-white/80 font-medium">
                {recipe.category.name}
              </p>
              <h3 className="text-2xl font-display text-white">
                {recipe.title}
              </h3>
              <div className="flex items-center mt-4 text-sm text-white">
                <div className="flex items-center gap-2">
                  <GeneratedAvatar
                    seed={recipe.author.name}
                    className="size-6"
                  />
                  <span className="font-semibold text-sm">
                    {recipe.author.name}
                  </span>
                </div>
                <span className="mx-1">•</span>
                <time dateTime={recipe.createdAt.toISOString()}>
                  {formatDistanceToNow(recipe.createdAt, {
                    addSuffix: true,
                    locale: pl,
                  })}
                </time>
              </div>
            </div>
            <Image
              src={getS3Url(recipe.file.key)}
              alt={recipe.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          </Link>
        ))}
      </div>
    </section>
  );
};
