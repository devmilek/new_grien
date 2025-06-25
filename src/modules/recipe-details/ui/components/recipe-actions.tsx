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
        size="sm"
        variant="outline"
        disabled={!session}
        onClick={() => mutate({ recipeId })}
      >
        <StarIcon
          className={cn(data?.liked && "fill-amber-600 text-amber-600")}
        />
        {data?.total}
      </Button>
      <ShareButton
        recipeId={recipeId}
        title={title}
        description={description}
      />
    </div>
  );
};
