"use client";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { DEFAULT_PAGE } from "@/contstants";
import { useTRPC } from "@/trpc/client";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import { pl } from "date-fns/locale";
import { FlagIcon, MoreVertical, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";

export const CommentsList = ({ recipeId }: { recipeId: string }) => {
  const trpc = useTRPC();
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const { data, isLoading } = useInfiniteQuery(
    trpc.comments.getComments.infiniteQueryOptions(
      {
        recipeId,
        cursor: DEFAULT_PAGE,
      },
      {
        initialCursor: 1,
        getNextPageParam: (lastPage) => {
          if (!lastPage.hasMore) return undefined;
          return lastPage.cursor + 1;
        },
      }
    )
  );

  const { mutateAsync: deleteComment } = useMutation(
    trpc.comments.delete.mutationOptions({
      onError: (error) => {
        toast.error(
          error.message ||
            "Nie udało się usunąć komentarza. Spróbuj ponownie później."
        );
      },
      onSuccess: () => {
        toast.success("Komentarz został usunięty!");
        // Invalidate the comments query to refresh the list
        queryClient.invalidateQueries({
          queryKey: trpc.comments.getComments.infiniteQueryKey(),
        });
      },
    })
  );

  const comments = data?.pages.flatMap((page) => page.items) || [];

  return (
    <div className="space-y-7">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-4">
          <GeneratedAvatar seed={comment.user.name} className="size-10" />
          <div className="flex-1">
            <p className="font-medium">
              {comment.user.name}{" "}
              <span className="text-sm text-muted-foreground font-normal">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: pl,
                })}
              </span>
            </p>
            <p className="text-muted-foreground mt-1">{comment.content}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" className="size-6" variant="ghost">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <FlagIcon /> Zgłoś komentarz
              </DropdownMenuItem>
              {session?.user.id === comment.userId && (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    toast.promise(deleteComment({ commentId: comment.id }), {
                      loading: "Usuwanie komentarza...",
                    });
                  }}
                >
                  <TrashIcon /> Usuń komentarz
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
      {comments.length === 0 && !isLoading && (
        <EmptyState
          title="Brak komentarzy"
          description="Nie ma jeszcze żadnych komentarzy do tego przepisu."
        />
      )}
    </div>
  );
};
