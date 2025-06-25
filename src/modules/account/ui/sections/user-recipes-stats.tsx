"use client";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  FileIcon,
  MessageCircleIcon,
  ThumbsUp,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Funkcja do obliczenia procentu przepisów z tego miesiąca
const calculateMonthlyPercentage = (thisMonth: number, total: number) => {
  if (total === 0) return 0;
  return Math.round((thisMonth / total) * 100);
};

export const UserRecipesStats = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.account.getRecipesStats.queryOptions()
  );

  const statsCards = [
    {
      title: "Twoje przepisy",
      value: data.recipesCount,
      icon: FileIcon,
      monthlyRatio: calculateMonthlyPercentage(
        data.recipesThisMonth,
        data.recipesCount
      ),
      additionalInfo: `W tym ${data.notPublishedCount} nieopublikowanych`,
    },
    {
      title: "Ilość polubień",
      value: data.likes,
      icon: ThumbsUp,
      monthlyRatio: calculateMonthlyPercentage(data.likesThisMonth, data.likes),
      additionalInfo: `W tym miesiącu ${data.likesThisMonth} polubień`,
    },
    {
      title: "Ilość komentarzy",
      value: data.comments,
      icon: MessageCircleIcon,
      monthlyRatio: calculateMonthlyPercentage(
        data.commentsThisMonth,
        data.comments
      ),
      additionalInfo: `W tym miesiącu ${data.commentsThisMonth} komentarzy`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {statsCards.map((card, index) => {
        const Icon = card.icon;

        return (
          <Card
            key={index}
            className={cn({
              "sm:col-span-2 lg:col-span-1": index === 0,
            })}
          >
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-primary">
                {card.value}
              </CardTitle>
              <CardAction>
                <Icon className="text-muted-foreground size-5" />
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium [&_svg:not([class*='size-'])]:size-4">
                {card.monthlyRatio}% w tym miesiącu
                {card.monthlyRatio > 0 ? (
                  <TrendingUpIcon />
                ) : (
                  <TrendingDownIcon />
                )}
              </div>
              <div className="text-muted-foreground">{card.additionalInfo}</div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export const UserRecipesStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card
          key={index}
          className={cn({
            "sm:col-span-2 lg:col-span-1": index === 0,
          })}
        >
          <CardHeader>
            <CardDescription>
              <Skeleton className="h-4 w-24" />
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <Skeleton className="h-8 w-16" />
            </CardTitle>
            <CardAction>
              <Skeleton className="size-5 rounded" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium items-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="size-4 rounded" />
            </div>
            <div className="text-muted-foreground">
              <Skeleton className="h-4 w-32" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
