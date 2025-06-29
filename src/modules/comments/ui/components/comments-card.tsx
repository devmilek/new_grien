import React from "react";
import { CommentForm } from "./comment-form";
import { Separator } from "@/components/ui/separator";
import { CommentsList } from "./comments-list";

interface CommentsCardProps {
  recipeId: string;
}

export const CommentsCard = ({ recipeId }: CommentsCardProps) => {
  return (
    <div className="p-6 rounded-2xl bg-background border">
      <h2 className="text-2xl font-display mb-4">Komentarze</h2>
      <CommentForm recipeId={recipeId} />
      <Separator className="my-4" />
      <CommentsList recipeId={recipeId} />
    </div>
  );
};
