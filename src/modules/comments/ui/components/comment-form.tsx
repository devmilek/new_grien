"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { CommentSchema, commentSchema } from "../../schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CommentFormProps {
  recipeId: string;
}

export const CommentForm = ({ recipeId }: CommentFormProps) => {
  const { data } = authClient.useSession();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<CommentSchema>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const { mutate, isPending } = useMutation(
    trpc.comments.create.mutationOptions({
      onError: (error) => {
        toast.error(
          error.message ||
            "Nie udało się dodać komentarza. Spróbuj ponownie później."
        );
      },
      onSuccess: () => {
        form.reset();
        toast.success("Komentarz został dodany!");
        queryClient.invalidateQueries({
          queryKey: trpc.comments.getComments.infiniteQueryKey(),
        });
      },
    })
  );

  const onSubmit = (data: CommentSchema) => {
    mutate({
      content: data.content,
      recipeId: recipeId,
    });
  };

  if (!data) {
    return null;
  }

  return (
    <Form {...form}>
      <form
        className="flex items-end flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea
                  placeholder="Napisz komentarz..."
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="sm"
          className="mt-2"
          variant="outline"
          disabled={isPending}
        >
          {isPending && <Loader2 className="animate-spin" />}
          Dodaj komentarz
        </Button>
      </form>
    </Form>
  );
};
