"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { signUpSchema, SignUpSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  AtSign,
  Loader2,
  LockIcon,
  MailIcon,
  User,
} from "lucide-react";
import { InputWithIcon, PasswordInputWithIcon } from "@/components/ui/input";
import { authClient, getErrorMessage } from "@/lib/auth/auth-client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const SignUpForm = () => {
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignUpSchema) => {
    setError(null);
    await authClient.signUp.email(
      {
        name: values.name,
        email: values.email,
        username: values.username,
        password: values.password,
      },
      {
        onSuccess: () => {
          form.reset();
          router.push("/logowanie");
          toast.success("Konto zostało utworzone. Możesz teraz się zalogować.");
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
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imię</FormLabel>
              <FormControl>
                <InputWithIcon
                  icon={User}
                  {...field}
                  type="text"
                  autoComplete="name"
                  disabled={isSubmitting}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa użytkownika</FormLabel>
              <FormControl>
                <InputWithIcon
                  icon={AtSign}
                  {...field}
                  type="text"
                  autoComplete="username"
                  disabled={isSubmitting}
                />
              </FormControl>
            </FormItem>
          )}
        />
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
          Zarejestruj się
        </Button>
      </form>
    </Form>
  );
};
