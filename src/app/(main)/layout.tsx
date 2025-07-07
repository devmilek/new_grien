import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import React from "react";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  prefetch(trpc.attributes.getAttributes.queryOptions());
  prefetch(trpc.attributes.getCategories.queryOptions());
  return (
    <>
      <HydrateClient>
        <Navbar />
        <main className="pt-20 pb-10 min-h-screen">{children}</main>
        <Footer />
      </HydrateClient>
    </>
  );
};

export default MainLayout;
