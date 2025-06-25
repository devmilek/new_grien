import React from "react";
import { GerUserRecipes } from "../../types";
import {
  ChartNoAxesColumnDecreasing,
  ClockIcon,
  EyeIcon,
  PenIcon,
  ShareIcon,
  SliceIcon,
  TagIcon,
  TagsIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import { formatDifficulty } from "@/lib/formatters";
import { getS3Url } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface UserRecipeCardProps {
  data: GerUserRecipes[number];
}

const UserRecipeCard = ({ data }: UserRecipeCardProps) => {
  const badges = [
    {
      icon: ChartNoAxesColumnDecreasing,
      label: formatDifficulty(data.difficulty),
    },
    {
      icon: TagIcon,
      label: data.category.name,
    },
    {
      icon: ClockIcon,
      label: `${data.preparationTime} min`,
    },
    {
      icon: SliceIcon,
      label: `${data.portions} ${data.portions === 1 ? "porcja" : "porcji"}`,
    },
    {
      icon: TagsIcon,
      label: data.attributes.length + " atrybutów",
    },
  ];
  return (
    <div
      key={data.id}
      className="bg-background p-4 pr-6 rounded-2xl border flex items-center gap-8"
    >
      <div className="relative aspect-[4/3] w-80 bg-muted rounded-xl overflow-hidden border">
        <Image
          src={getS3Url(data.fileId)}
          fill
          alt={data.title}
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <h2 className="text-2xl font-display">{data.title}</h2>
        <p className="line-clamp-3 mt-1 mb-3 text-muted-foreground">
          {data.description}
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">
            {data.published ? "Opublikowany" : "Wersja robocza"}
          </Badge>
          {badges.map((badge, index) => (
            <Badge key={index} variant="outline">
              <badge.icon />
              {badge.label}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="icon">
          <Link href={`/utworz-przepis/${data.id}`}>
            <PenIcon />
          </Link>
        </Button>
        <Button variant="outline" size="icon">
          <EyeIcon />
        </Button>
        <Button variant="outline" size="icon">
          <ShareIcon />
        </Button>
        <Button variant="outline" size="icon">
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
};

const UserRecipeCardSkeleton = () => {
  return (
    <div className="bg-background p-4 pr-6 rounded-2xl border flex items-center gap-8">
      {/* Image skeleton */}
      <div className="relative aspect-[4/3] w-80 bg-muted rounded-xl overflow-hidden border">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content skeleton */}
      <div className="flex-1 space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-8 w-3/4" />

        {/* Description skeleton - 3 lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Badges skeleton */}
        <div className="flex gap-2 flex-wrap pt-1">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-18" />
          <Skeleton className="h-6 w-22" />
        </div>
      </div>

      {/* Action buttons skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>
    </div>
  );
};

export { UserRecipeCard, UserRecipeCardSkeleton };
