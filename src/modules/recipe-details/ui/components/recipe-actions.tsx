"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StarIcon } from "lucide-react";
import React from "react";
import { ShareButton } from "./share-button";

export const RecipeActions = ({
  recipeId,
  title,
  description,
}: {
  recipeId: string;
  title: string;
  description: string;
}) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const { data } = useQuery(
    trpc.recipeDetails.getLikesMeta.queryOptions({
      recipeId,
    })
  );

  const { mutate } = useMutation(
    trpc.recipeDetails.toggleLike.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.recipeDetails.getLikesMeta.queryOptions({
            recipeId,
          })
        );
      },
    })
  );

  return (
    <div className="pt-4 border-t flex items-center justify-between">
      <Button
        className="py-0 pe-0"
        variant="outline"
        size="sm"
        onClick={() => mutate({ recipeId })}
        disabled={!session}
      >
        <StarIcon
          aria-hidden="true"
          className={cn(data?.liked && "fill-amber-600 text-amber-600")}
        />
        Polub
        <span className="text-muted-foreground before:bg-input relative ms-1 inline-flex h-full items-center justify-center rounded-full pl-3 text-xs font-medium before:absolute before:inset-0 before:left-0 before:w-px">
          {data?.total}
        </span>
      </Button>
      <ShareButton
        recipeId={recipeId}
        title={title}
        description={description}
      />
    </div>
  );
};
