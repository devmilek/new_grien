"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChefHatIcon, Mail, Globe, Heart } from "lucide-react";
import Link from "next/link";
import React from "react";

export const Footer = () => {
  const trpc = useTRPC();
  const { data: attributes } = useSuspenseQuery(
    trpc.attributes.getAttributes.queryOptions()
  );
  const { data: categories } = useSuspenseQuery(
    trpc.attributes.getCategories.queryOptions()
  );

  const popularCategories = categories.slice(0, 6);
  const popularCuisines = attributes.cuisines.slice(0, 8);
  const popularOccasions = attributes.occasions.slice(0, 6);

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-medium font-display text-2xl text-primary mb-4"
            >
              <ChefHatIcon className="size-8" />
              grien
            </Link>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Odkryj kulinarne sekrety, Grien to pasja, inspiracja i smak w
              jednym miejscu. Dołącz do społeczności kulinarnych pasjonatów.
            </p>
            <div className="flex gap-4">
              <Link
                href="mailto:hello@grien.pl"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="size-4" />
                Kontakt
              </Link>
              <Link
                href="/o-nas"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Globe className="size-4" />O nas
              </Link>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Popularne kategorie
            </h3>
            <ul className="space-y-2">
              {popularCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/kategorie/${category.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Cuisines */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Kuchnie świata
            </h3>
            <ul className="space-y-2">
              {popularCuisines.map((cuisine) => (
                <li key={cuisine.id}>
                  <Link
                    href={`/przepisy?atrybuty=${cuisine.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {cuisine.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Occasions & More */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Okazje specjalne
            </h3>
            <ul className="space-y-2">
              {popularOccasions.map((occasion) => (
                <li key={occasion.id}>
                  <Link
                    href={`/przepisy?atrybuty=${occasion.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {occasion.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left max-w-2xl">
            <p className="text-xs text-muted-foreground mb-2">
              © 2025 Grien. Część przepisów jest opublikowana zgodnie z licencją
              Creative Commons. Nieoznaczone tą licencją przepisy należą do ich
              twórców i zabronione jest ich kopiowanie.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-1 text-xs text-muted-foreground">
              <span>Stworzone z</span>
              <Heart className="size-3 text-red-500" />
              <span>przez</span>
              <Link
                href="https://asteriostudio.com"
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                asteriostudio.com
              </Link>
              <span>oraz</span>
              <Link
                href="https://devmilek.com"
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Miłosz Kraiński
              </Link>
            </div>
          </div>

          {/* Additional Links */}
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link
              href="/polityka-prywatnosci"
              className="hover:text-primary transition-colors"
            >
              Polityka prywatności
            </Link>
            <Link
              href="/regulamin"
              className="hover:text-primary transition-colors"
            >
              Regulamin
            </Link>
            <Link
              href="/cookies"
              className="hover:text-primary transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
