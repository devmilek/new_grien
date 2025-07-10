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

interface ConfirmEmailProps {
  name?: string;
  confirmationUrl?: string;
}

export default function ConfirmationEmail({
  name = "Użytkowniku",
  confirmationUrl = "https://example.com/confirm",
}: ConfirmEmailProps) {
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
                  Potwierdź swój adres email
                </Heading>
                <Text className="text-gray-600 text-base">
                  Witaj {name}! Jeszcze jeden krok do pełnego korzystania z
                  Grien.
                </Text>
              </div>
            </Section>

            {/* Main Content */}
            <Section className="bg-white px-8 py-6">
              <Text className="text-gray-700 text-base leading-relaxed mb-6">
                Dziękujemy za rejestrację w Grien! Aby dokończyć proces
                rejestracji i zacząć dzielić się swoimi ulubionymi przepisami,
                kliknij poniższy przycisk, aby potwierdzić swój adres email.
              </Text>

              <div className="text-center mb-6">
                <Button
                  className="w-full rounded-lg bg-primary py-3 font-semibold text-white"
                  href={confirmationUrl}
                >
                  Potwierdź email
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

              <div className="bg-blue-50 border-l-4 border-primary p-4 rounded-r-lg">
                <Text className="text-gray-700 text-sm mb-2">
                  <strong>Dlaczego to ważne?</strong>
                </Text>
                <Text className="text-gray-600 text-sm">
                  Potwierdzenie adresu email pozwala nam:
                </Text>
                <ul className="text-gray-600 text-sm mt-2 pl-4 space-y-3">
                  <li>Chronić Twoje konto przed nieautoryzowanym dostępem</li>
                  <li>Wysyłać ważne powiadomienia o Twoich przepisach</li>
                  <li>Pomóc w odzyskaniu konta w razie problemów</li>
                </ul>
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
                Jeśli nie rejestrowałeś się w Grien, możesz bezpiecznie
                zignorować ten email.
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
