import React from "react";
import { CheckCircle, Heart, Users, ChefHat } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AccountDeleted = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Konto zostało usunięte
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          Twoje konto w Grien zostało pomyślnie usunięte. Wszystkie dane
          związane z Twoim kontem zostały trwale usunięte z naszych serwerów.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Co zostało usunięte:
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-center">
              <ChefHat className="w-4 h-4 mr-2 text-gray-400" />
              Wszystkie przepisy i składniki
            </li>
            <li className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-gray-400" />
              Komentarze i oceny
            </li>
            <li className="flex items-center">
              <Heart className="w-4 h-4 mr-2 text-gray-400" />
              Ulubione przepisy
            </li>
          </ul>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            Dziękujemy za to, że byłeś częścią społeczności Grien. Będzie nam
            Cię brakowało! 👋
          </p>
        </div>

        <div className="space-y-3">
          <Button asChild size="lg" className="w-full">
            <Link href="/">Przejdź do strony głównej</Link>
          </Button>

          <Button asChild size="lg" variant="outline" className="w-full">
            <Link href="/rejestracja">Załóż nowe konto</Link>
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Jeśli usunąłeś konto przypadkowo lub masz pytania,{" "}
            <Link
              href="/kontakt"
              className="text-primary hover:text-primary/80 underline"
            >
              skontaktuj się z nami
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountDeleted;
