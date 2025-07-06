import React from "react";
import { GetRecipe } from "../../types";
import Image from "next/image";
import { getS3Url } from "@/lib/utils";
import { GeneratedAvatar } from "@/components/generated-avatar";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale/pl";
import { Badge } from "@/components/ui/badge";
import { getRecipeBadges } from "../../utils";
import { RecipeActions } from "../components/recipe-actions";

export const RecipeHero = ({ data }: { data: GetRecipe }) => {
  const badges = getRecipeBadges(data);

  return (
    <div className="p-6 rounded-2xl border bg-background grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <Image src={getS3Url(data.file.key)} fill alt={data.title} />
      </div>
      <div className="flex flex-col">
        <h1 className="text-3xl font-display">{data.title}</h1>
        <div className="flex items-center mt-4 gap-1 text-sm text-muted-foreground">
          <Link href="/" className="flex items-center gap-2">
            <GeneratedAvatar seed={data.author.name} className="size-8" />
            <span className="text-primary font-semibold text-sm">
              {data.author.name}
            </span>
          </Link>
          <span className="mx-2 text-muted-foreground">•</span>
          <time dateTime={data.createdAt.toISOString()}>
            {formatDistanceToNow(data.createdAt, {
              addSuffix: true,
              locale: pl,
            })}
          </time>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {badges.map((badge, index) => (
            <Badge key={index} variant="outline">
              <badge.icon />
              {badge.label}
            </Badge>
          ))}
        </div>
        <p className="text-muted-foreground flex-1 mt-4 pb-4">
          {data.description}
        </p>
        <RecipeActions
          recipeId={data.id}
          title={data.title}
          description={data.description}
        />
      </div>
    </div>
  );
};
