"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChefHatIcon, SearchIcon, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      <div className="container mx-auto h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-medium font-display text-2xl text-primary"
          >
            <ChefHatIcon className="size-6" />
            <span className="hidden sm:inline">grien</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
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
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Button */}
          <button className="border-input bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-9 w-fit rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] hidden md:flex">
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

          {/* Mobile Search Icon */}
          <button className="md:hidden p-2 hover:bg-muted rounded-md">
            <SearchIcon size={20} />
          </button>

          {/* Auth Buttons */}
          {data ? (
            <UserMenu />
          ) : (
            <>
              <Button
                asChild
                variant="outline"
                className="hidden sm:inline-flex"
              >
                <Link href="/logowanie">Zaloguj się</Link>
              </Button>
              <Button asChild className="hidden sm:inline-flex">
                <Link href="/rejestracja">Zarejestruj się</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden hover:bg-muted rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-background max-h-screen overflow-y-scroll">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-primary mb-2">Kategorie</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/kategorie/${category.slug}`}
                      className="hover:underline"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-primary mb-2">
                  Kuchnie świata
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {attributes.cuisines.map((cuisine) => (
                    <Link
                      key={cuisine.id}
                      href={`/kuchnie-swiata/${cuisine.slug}`}
                      className="hover:underline"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {cuisine.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-primary mb-2">Okazje</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {attributes.occasions.map((occasion) => (
                    <Link
                      key={occasion.id}
                      href={`/okazje/${occasion.slug}`}
                      className="hover:underline"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {occasion.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-primary mb-2">Diety</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {attributes.diets.map((diet) => (
                    <Link
                      key={diet.id}
                      href={`/diety/${diet.slug}`}
                      className="hover:underline"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {diet.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Auth Buttons */}
            {!data && (
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Button asChild variant="outline" className="w-full">
                  <Link
                    href="/logowanie"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Zaloguj się
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link
                    href="/rejestracja"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Zarejestruj się
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
