"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChefHatIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { UserMenu } from "./user-menu";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "../ui/button";

export const Navbar = () => {
  const trpc = useTRPC();
  const { data: attributes } = useSuspenseQuery(
    trpc.attributes.getAttributes.queryOptions()
  );
  const { data: categories } = useSuspenseQuery(
    trpc.attributes.getCategories.queryOptions()
  );

  const { data } = authClient.useSession();

  return (
    <header className="border-b bg-background w-full fixed top-0 z-50">
      <div className="container mx-auto h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-medium font-display text-2xl text-primary"
          >
            <ChefHatIcon className="size-6" />
            grien
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Kategorie</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-max p-6">
                    <h3 className="text-2xl text-primary font-display mb-4">
                      Kategorie
                    </h3>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-32">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/kategorie/${category.slug}`}
                          className="hover:underline"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Kuchnie świata</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-max p-6">
                    <h3 className="text-2xl text-primary font-display mb-4">
                      Kuchnie świata
                    </h3>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-32">
                      {attributes.cuisines.map((cuisine) => (
                        <Link
                          key={cuisine.id}
                          href={`/kuchnie-swiata/${cuisine.slug}`}
                          className="hover:underline"
                        >
                          {cuisine.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Okazje</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-max p-6">
                    <h3 className="text-2xl text-primary font-display mb-4">
                      Okazje
                    </h3>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-32">
                      {attributes.occasions.map((cuisine) => (
                        <Link
                          key={cuisine.id}
                          href={`/okazje/${cuisine.slug}`}
                          className="hover:underline"
                        >
                          {cuisine.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Diety</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-max p-6">
                    <h3 className="text-2xl text-primary font-display mb-4">
                      Diety
                    </h3>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-32">
                      {attributes.diets.map((cuisine) => (
                        <Link
                          key={cuisine.id}
                          href={`/diety/${cuisine.slug}`}
                          className="hover:underline"
                        >
                          {cuisine.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-4">
          <button className="border-input bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-9 w-fit rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]">
            <span className="flex grow items-center">
              <SearchIcon
                className="text-muted-foreground/80 -ms-1 me-3"
                size={16}
                aria-hidden="true"
              />
              <span className="text-muted-foreground/70 font-normal">
                Wyszukaj...
              </span>
            </span>
            <kbd className="bg-background text-muted-foreground/70 ms-12 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
              ⌘K
            </kbd>
          </button>
          {data ? (
            <UserMenu />
          ) : (
            <>
              <Button asChild variant="outline">
                <Link href="/logowanie">Zaloguj się</Link>
              </Button>
              <Button asChild>
                <Link href="/rejestracja">Zarejestruj się</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
