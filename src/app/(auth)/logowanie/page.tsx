import { getCurrentSession } from "@/lib/auth/get-current-session";
import { SignInForm } from "@/modules/auth/ui/components/sign-in-form";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const SignInPage = async () => {
  const { user } = await getCurrentSession();

  if (user) {
    redirect("/");
  }

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-display">Witaj ponownie</h1>
        <p className="text-muted-foreground text-sm mt-2">
          Kontynuuj swoją kulinarną przygodę i zaloguj się z użyciem adresu
          email.
        </p>
      </header>
      <SignInForm />
      <p className="text-muted-foreground text-sm mt-8 text-center">
        Nie masz jeszcze konta?{" "}
        <Link
          href="/rejestracja"
          className="text-primary font-medium hover:underline"
        >
          Zarejestruj się
        </Link>
      </p>
    </>
  );
};

export default SignInPage;
