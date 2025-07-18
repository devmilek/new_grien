import { Metadata } from "next";

export function constructMetadata({
  title = "Grien — Podziel się swoimi przepisami kulinarnymi",
  description = "Grien to miejsce, w którym możesz dzielić się swoimi przepisami, odkrywać nowe smaki i inspirować się kuchnią z całego świata.",
  image = "/opengraph.png",
  url,
  noIndex = false,
  canonicalUrl,
}: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}): Metadata {
  return {
    title: title
      ? `${title} | Grien`
      : "Grien — Podziel się swoimi przepisami kulinarnymi",
    appleWebApp: {
      title: "Grien",
      statusBarStyle: "default",
      capable: true,
    },
    icons: [
      {
        rel: "icon",
        type: "image/png",
        url: "/favicon-96x96.png",
        sizes: "96x96",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        url: "/favicon.svg",
      },
      {
        rel: "shortcut icon",
        url: "/favicon.ico",
      },
      {
        rel: "apple-touch-icon",
        url: "/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
    description,
    ...((url || canonicalUrl) && {
      alternates: {
        canonical: url || canonicalUrl,
      },
    }),
    openGraph: {
      title,
      description,
      ...(image && {
        images: image,
      }),
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && {
        images: image,
      }),
      creator: "@grien",
    },
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
