import { getCurrentSession } from "@/lib/auth/get-current-session";
import { SignUpForm } from "@/modules/auth/ui/components/sign-up-form";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const SignUpPage = async () => {
  const { user } = await getCurrentSession();

  if (user) {
    redirect("/");
  }

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-display">Utwórz konto</h1>
        <p className="text-muted-foreground text-sm mt-2">
          Zacznij swoją kulinarną przygodę i utwórz swoje konto z użyciem adresu
          email.
        </p>
      </header>
      <SignUpForm />
      <p className="text-muted-foreground text-sm mt-8 text-center">
        Masz już konto?{" "}
        <Link
          href="/logowanie"
          className="text-primary font-medium hover:underline"
        >
          Zaloguj się
        </Link>
      </p>
    </>
  );
};

export default SignUpPage;
