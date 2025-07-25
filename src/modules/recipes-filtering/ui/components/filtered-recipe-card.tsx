import React from "react";
import { FilteredRecipes } from "../../types";
import {
  ChartNoAxesColumnDecreasing,
  ClockIcon,
  SliceIcon,
  TagIcon,
  TagsIcon,
} from "lucide-react";
import {
  formatAttributeIcon,
  formatAttributeType,
  formatDifficulty,
  formatTime,
} from "@/lib/formatters";
import Image from "next/image";
import { getRecipeSlug, getS3Url, getUserSlug } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { pluralizeAttributes, pluralizePortions } from "@/lib/pluralize";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ImageLicenseBadge from "@/components/image-license-badge";

export const FilteredRecipeCard = ({
  data,
}: {
  data: FilteredRecipes[number];
}) => {
  const badges = [
    {
      icon: ChartNoAxesColumnDecreasing,
      label: formatDifficulty(data.difficulty),
      tooltip: "Poziom trudności",
    },
    {
      icon: TagIcon,
      label: data.category.name,
      tooltip: "Kategoria",
    },
    {
      icon: ClockIcon,
      label: formatTime(data.preparationTime),
      tooltip: "Czas przygotowania",
    },
    {
      icon: SliceIcon,
      label: pluralizePortions(data.portions),
      tooltip: "Ilość porcji",
    },
  ];

  if (data.attributes.length > 3) {
    badges.push({
      icon: TagsIcon,
      label: pluralizeAttributes(data.attributes.length),
      tooltip: "Atrybuty",
    });
  } else {
    data.attributes.forEach((attribute) => {
      badges.push({
        icon: formatAttributeIcon(attribute.attribute.type),
        label: attribute.attribute.name,
        tooltip: formatAttributeType(attribute.attribute.type),
      });
    });
  }

  return (
    <div className="bg-background flex flex-col items-center gap-4 @lg:gap-8 @lg:flex-row group">
      <Link
        href={`/przepisy/${getRecipeSlug(data.id, data.title)}`}
        className="relative aspect-[4/3] w-full @lg:w-64 bg-muted rounded-xl overflow-hidden border block"
      >
        {data.license && (
          <ImageLicenseBadge
            className="absolute top-2 right-2 z-40"
            licence={data.license}
          />
        )}
        <Image
          src={getS3Url(data.file.key)}
          fill
          alt={data.title}
          className="object-cover group-hover:scale-105 transition-transform"
        />
      </Link>

      <div className="flex-1">
        <Link
          href={`/kategorie/${data.category.slug}`}
          className="text-xs text-primary font-medium hover:underline inline-block mb-2"
        >
          {data.category.name}
        </Link>

        <Link
          href={`/przepisy/${getRecipeSlug(data.id, data.title)}`}
          className="block"
        >
          <h2 className="text-xl font-display group-hover:underline">
            {data.title}
          </h2>
        </Link>

        <p className="line-clamp-2 mt-3 mb-4 text-muted-foreground text-sm">
          {data.description}
        </p>

        <div className="flex gap-2 flex-wrap">
          {badges.map((badge, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Badge key={index} variant="outline">
                  <badge.icon />
                  {badge.label}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>{badge.tooltip}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="flex items-center text-sm text-muted-foreground mt-4">
          <Link
            href={
              "/kucharze/" + getUserSlug(data.author.id, data.author.username)
            }
            className="flex items-center gap-2"
          >
            <GeneratedAvatar
              seed={data.author.name}
              className="size-8"
              verified={data.author.verified || false}
            />
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
      </div>
    </div>
  );
};

export const FilteredRecipeCardSkeleton = () => {
  return (
    <div className="bg-background flex items-center gap-8">
      {/* Image skeleton */}
      <div className="relative aspect-[4/3] @lg:w-64 bg-muted rounded-xl overflow-hidden border">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content skeleton */}
      <div className="flex-1">
        {/* Category link skeleton */}
        <Skeleton className="h-4 w-24 mb-2" />

        {/* Title skeleton */}
        <Skeleton className="h-8 w-80 mb-3" />

        {/* Description skeleton - 2 lines */}
        <div className="mt-3 mb-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Badges skeleton */}
        <div className="flex gap-2 flex-wrap mb-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-16 rounded-full" />
          ))}
        </div>

        {/* Author and date skeleton */}
        <div className="flex items-center text-sm">
          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-1 mx-2" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
};
