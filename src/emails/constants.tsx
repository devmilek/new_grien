import { Font, TailwindConfig } from "@react-email/components";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const tailwindConfig: TailwindConfig = {
  theme: {
    extend: {
      colors: {
        primary: "#147859",
        secondary: "#ecf4f0",
        muted: "#505754",
      },
    },
  },
};

export const EmailFont = () => {
  return (
    <Font
      fontFamily="Geist"
      fallbackFontFamily="Verdana"
      webFont={{
        url: "https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap",
        format: "woff2",
      }}
      fontWeight={400}
      fontStyle="normal"
    />
  );
};
