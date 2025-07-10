"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInputWithIcon } from "@/components/ui/input";
import { authClient, getErrorMessage } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, Loader2, LockIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    currentPassword: z.string().min(1, "Obecne hasło jest wymagane"),
    newPassword: z.string().min(1, "Nowe hasło jest wymagane"),
    confirmPassword: z.string().min(1, "Musisz potwierdzić nowe hasło"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ChangePasswordCard = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirmPassword: "",
      currentPassword: "",
      newPassword: "",
    },
  });

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      revokeOtherSessions: true,
      fetchOptions: {
        onSuccess: () => {
          toast.success("Hasło zostało zmienione pomyślnie.");
          form.reset();
        },
        onError: ({ error }) => {
          setError(getErrorMessage(error.code));
        },
      },
    });
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="rounded-lg border shadow bg-background overflow-hidden">
      <div className="p-6">
        <Form {...form}>
          <form className="grid gap-4">
            <FormField
              name="currentPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Obecne hasło
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <PasswordInputWithIcon
                      icon={LockIcon}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nowe hasło
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <PasswordInputWithIcon
                      icon={LockIcon}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Potwierdź nowe hasło
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <PasswordInputWithIcon
                      icon={LockIcon}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Błąd</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </Form>
      </div>
      <div className="flex justify-end py-4 px-6 border-t bg-muted">
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading && <Loader2 className="animate-spin" />}
          Zmień hasło
        </Button>
      </div>
    </div>
  );
};
