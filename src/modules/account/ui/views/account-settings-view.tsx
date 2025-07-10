import { AnnotatedLayout, AnnotatedSection } from "@/components/annotated";
import React from "react";
import { ChangePasswordCard } from "../components/change-password-card";
import { DeleteAccountCard } from "../components/delete-account-card";

export const AccountSettingsView = () => {
  return (
    <div>
      <h1 className="text-2xl font-display max-w-4xl mb-4 mx-auto">
        Ustawienia konta
      </h1>
      <AnnotatedLayout>
        <AnnotatedSection
          title="Zmień hasło"
          description="Aby dokonać aktualizacji, wprowadź istniejące hasło, a następnie nowe. Jeśli nie znasz istniejącego hasła, wyloguj się i użyj linku zapomniałem hasła."
        >
          <ChangePasswordCard />
        </AnnotatedSection>
        <AnnotatedSection
          title="Usuń konto"
          description="Usunięcia konta nie można cofnąć."
        >
          <DeleteAccountCard />
        </AnnotatedSection>
      </AnnotatedLayout>
    </div>
  );
};
