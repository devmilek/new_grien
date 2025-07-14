"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { authClient, getErrorMessage } from "@/lib/auth/auth-client";
import React from "react";
import { toast } from "sonner";

export const DeleteAccountCard = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleDeleteAccount = async () => {
    await authClient.deleteUser(
      {
        callbackURL: "/konto/usuniete",
      },
      {
        onSuccess: () => {
          toast.success(
            "Email z potwierdzeniem usunięcia konta został wysłany. Sprawdź swoją skrzynkę odbiorczą."
          );
          setIsOpen(false);
        },
        onError: ({ error }) => {
          toast.error(
            getErrorMessage(error.code) ||
              "Wystąpił błąd podczas usuwania konta."
          );
          setIsOpen(false);
        },
      }
    );
  };
  return (
    <div className="rounded-lg border border-destructive shadow bg-background overflow-hidden">
      <div className="p-6">
        <p className="text-muted-foreground text-sm">
          Usunięcie konta jest nieodwracalne. Wszystkie dane użytkownika zostaną
          trwale usunięte z naszych serwerów.
        </p>
      </div>
      <div className="flex justify-end py-4 px-6 border-t bg-muted">
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Usuń konto</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Czy na pewno chcesz usunąć swoje konto?
              </AlertDialogTitle>
              <AlertDialogDescription>
                To działanie jest nieodwracalne i spowoduje utratę wszystkich
                danych związanych z Twoim kontem.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Anuluj</AlertDialogCancel>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Kontynuuj
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
