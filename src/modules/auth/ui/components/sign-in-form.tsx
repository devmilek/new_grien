"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { signInSchema, SignInSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, LockIcon, MailIcon } from "lucide-react";
import { InputWithIcon, PasswordInputWithIcon } from "@/components/ui/input";
import { authClient, getErrorMessage } from "@/lib/auth/auth-client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const SignInForm = () => {
  const [error, setError] = React.useState<string | null>(null);
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInSchema) => {
    setError(null);
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          form.reset();
        },
        onError: ({ error }) => {
          if (error.code) {
            setError(getErrorMessage(error.code));
          } else {
            setError("Wystąpił nieoczekiwany błąd. Proszę spróbować ponownie.");
          }
        },
      }
    );
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <InputWithIcon
                  icon={MailIcon}
                  {...field}
                  type="email"
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hasło</FormLabel>
              <FormControl>
                <PasswordInputWithIcon
                  icon={LockIcon}
                  {...field}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {error && (
          <Alert variant="destructive">
            <AlertTriangle />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          Zaloguj się
        </Button>
      </form>
    </Form>
  );
};
