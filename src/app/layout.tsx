import type { Metadata } from "next";
import { Geist, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TooltipProvider } from "@/components/ui/tooltip";
import { constructMetadata } from "@/lib/construct-metadata";
import { AptabaseProvider } from "@aptabase/react";

export const metadata: Metadata = constructMetadata({});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${dmSerifDisplay.variable} antialiased bg-zinc-100`}
      >
        <AptabaseProvider appKey={`${process.env.NEXT_PUBLIC_APT_BASE!}`}>
          <TooltipProvider>
            <NuqsAdapter>
              <TRPCReactProvider>
                {children}
                <Toaster richColors theme="light" visibleToasts={5} />
              </TRPCReactProvider>
            </NuqsAdapter>
          </TooltipProvider>
        </AptabaseProvider>
      </body>
    </html>
  );
}
