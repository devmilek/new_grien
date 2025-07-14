import {
  Tailwind,
  Button,
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Img,
} from "@react-email/components";
import "dotenv/config";

import * as React from "react";
import { BASE_URL, EmailFont, tailwindConfig } from "./constants";

interface AccountDeletionConfirmationProps {
  name?: string;
  confirmationUrl?: string;
}

export default function AccountDeletionConfirmationEmail({
  name = "Użytkowniku",
  confirmationUrl = "https://example.com/confirm-deletion",
}: AccountDeletionConfirmationProps) {
  return (
    <Tailwind config={tailwindConfig}>
      <Html>
        <Head>
          <EmailFont />
        </Head>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto py-8 px-4">
            {/* Header */}
            <Section className="bg-white rounded-t-lg px-8 py-6">
              <div className="text-center">
                <Img
                  src={`${BASE_URL}/favicon.svg`}
                  alt="Grien Logo"
                  width="60"
                  height="60"
                  className="mx-auto mb-4 rounded-full"
                />
                <Heading className="text-2xl font-bold text-gray-900 mb-2">
                  Potwierdź usunięcie konta
                </Heading>
                <Text className="text-gray-600 text-base">
                  {name}, otrzymaliśmy prośbę o usunięcie Twojego konta.
                </Text>
              </div>
            </Section>

            {/* Main Content */}
            <Section className="bg-white px-8 py-6">
              <Text className="text-gray-700 text-base leading-relaxed mb-6">
                Przykro nam słyszeć, że chcesz opuścić Grien. Aby potwierdzić
                usunięcie konta, kliknij poniższy przycisk. Ta akcja jest
                <strong> nieodwracalna</strong> i spowoduje trwałe usunięcie
                wszystkich Twoich danych.
              </Text>

              <div className="text-center mb-6">
                <Button
                  className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700"
                  href={confirmationUrl}
                >
                  Potwierdź usunięcie konta
                </Button>
              </div>

              <Text className="text-gray-600 text-sm mb-4">
                Jeśli przycisk nie działa, możesz skopiować i wkleić poniższy
                link do przeglądarki:
              </Text>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <Text className="text-gray-700 text-sm break-all">
                  {confirmationUrl}
                </Text>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <Text className="text-gray-700 text-sm mb-2">
                  <strong>Co zostanie usunięte?</strong>
                </Text>
                <Text className="text-gray-600 text-sm">
                  Usunięcie konta spowoduje trwałe usunięcie:
                </Text>
                <ul className="text-gray-600 text-sm mt-2 pl-4 space-y-3">
                  <li>Wszystkich Twoich przepisów i składników</li>
                  <li>Komentarzy i ocen</li>
                  <li>Danych profilu i preferencji</li>
                  <li>Historii aktywności</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mt-4">
                <Text className="text-gray-700 text-sm mb-2">
                  <strong>Nie chcesz jeszcze odchodzić?</strong>
                </Text>
                <Text className="text-gray-600 text-sm">
                  Jeśli zmieniłeś zdanie, po prostu zignoruj ten email. Twoje
                  konto pozostanie aktywne.
                </Text>
              </div>
            </Section>

            {/* Footer */}
            <Section className="bg-white rounded-b-lg px-8 py-6">
              <Hr className="border-gray-200 my-4" />

              <Text className="text-gray-500 text-sm text-center mb-4">
                Ten link wygaśnie za <strong>godzinę</strong> ze względów
                bezpieczeństwa.
              </Text>

              <Text className="text-gray-500 text-sm text-center mb-2">
                Jeśli nie prosiłeś o usunięcie konta, skontaktuj się z nami
                natychmiast.
              </Text>

              <Text className="text-gray-500 text-sm text-center">
                © {new Date().getFullYear()} Grien. Wszystkie prawa
                zastrzeżone.
              </Text>

              <div className="text-center mt-4">
                <Text className="text-gray-400 text-xs">
                  Grien - Twoje miejsce na najlepsze przepisy
                </Text>
              </div>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
