import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [usernameClient()],
});

type ErrorTypes = Partial<Record<keyof typeof authClient.$ERROR_CODES, string>>;

const errorCodes = {
  USER_ALREADY_EXISTS:
    "Użytkownik o podanym adresie email lub nazwie użytkownika już istnieje.",
  ACCOUNT_NOT_FOUND: "Nie znaleziono konta o podanym adresie email.",
  INVALID_PASSWORD:
    "Hasło musi zawierać co najmniej 8 znaków, w tym wielką literę, małą literę, cyfrę i znak specjalny.",
  INVALID_USERNAME:
    "Nazwa użytkownika może zawierać tylko litery, cyfry i znaki podkreślenia, oraz musi mieć od 3 do 20 znaków.",
  INVALID_EMAIL: "Podany adres email jest nieprawidłowy.",
  PASSWORD_TOO_SHORT: "Hasło musi mieć co najmniej 8 znaków.",
  PASSWORD_TOO_LONG: "Hasło nie może przekraczać 64 znaków.",
  USERNAME_TOO_SHORT: "Nazwa użytkownika musi mieć co najmniej 3 znaki.",
  USERNAME_TOO_LONG: "Nazwa użytkownika nie może przekraczać 20 znaków.",
  CREDENTIAL_ACCOUNT_NOT_FOUND:
    "Nie znaleziono konta z podanymi danymi uwierzytelniającymi.",
  EMAIL_CAN_NOT_BE_UPDATED:
    "Adres email nie może być zaktualizowany, ponieważ jest to konto zewnętrzne.",
  EMAIL_NOT_VERIFIED:
    "Adres email nie został zweryfikowany. Proszę sprawdzić swoją skrzynkę odbiorczą i kliknąć link weryfikacyjny.",
  FAILED_TO_CREATE_SESSION:
    "Nie udało się utworzyć sesji. Proszę spróbować ponownie.",
  FAILED_TO_CREATE_USER:
    "Nie udało się utworzyć użytkownika. Proszę spróbować ponownie.",
  FAILED_TO_UPDATE_USER:
    "Nie udało się zaktualizować użytkownika. Proszę spróbować ponownie.",
  FAILED_TO_GET_SESSION:
    "Nie udało się pobrać sesji. Proszę spróbować ponownie.",
  FAILED_TO_GET_USER_INFO:
    "Nie udało się pobrać informacji o użytkowniku. Proszę spróbować ponownie.",
  FAILED_TO_UNLINK_LAST_ACCOUNT:
    "Nie można odłączyć ostatniego konta. Proszę dodać nowe konto przed odłączeniem tego.",
  ID_TOKEN_NOT_SUPPORTED:
    "Id token nie jest obsługiwany. Proszę użyć innego sposobu logowania.",
  INVALID_EMAIL_OR_PASSWORD:
    "Nieprawidłowy adres email lub hasło. Proszę spróbować ponownie.",
  INVALID_TOKEN: "Nieprawidłowy token. Proszę spróbować ponownie.",
  INVALID_USERNAME_OR_PASSWORD:
    "Nieprawidłowa nazwa użytkownika lub hasło. Proszę spróbować ponownie.",
  PROVIDER_NOT_FOUND: "Dostawca logowania nie został znaleziony.",

  SESSION_EXPIRED: "Sesja wygasła. Proszę zalogować się ponownie.",
  SOCIAL_ACCOUNT_ALREADY_LINKED:
    "Konto społecznościowe jest już powiązane z innym kontem. Proszę użyć innego konta społecznościowego lub odłączyć istniejące konto",
  UNEXPECTED_ERROR:
    "Wystąpił nieoczekiwany błąd. Proszę spróbować ponownie później.",
  USER_ALREADY_HAS_PASSWORD:
    "Użytkownik już ma hasło. Proszę użyć innej metody logowania.",
  USER_EMAIL_NOT_FOUND:
    "Nie znaleziono użytkownika o podanym adresie email. Proszę sprawdzić adres email i spróbować ponownie.",
  USER_NOT_FOUND:
    "Nie znaleziono użytkownika. Proszę sprawdzić dane logowania i spróbować ponownie.",
  USERNAME_IS_ALREADY_TAKEN:
    "Nazwa użytkownika jest już zajęta. Proszę wybrać inną nazwę użytkownika.",
} satisfies ErrorTypes;

export const getErrorMessage = (code: string) => {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes];
  }
  return "";
};
