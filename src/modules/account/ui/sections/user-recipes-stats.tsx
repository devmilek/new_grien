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
    <div className="grid grid-cols-3 gap-4">
      {statsCards.map((card, index) => {
        const Icon = card.icon;

        return (
          <Card key={index} className="@container/card">
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
