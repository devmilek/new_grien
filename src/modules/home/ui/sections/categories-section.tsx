"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const CategoriesSection = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.attributes.getCategories.queryOptions()
  );

  const [showAll, setShowAll] = useState(false);

  const initialCategories = data.slice(0, 5);
  const additionalCategories = data.slice(5);
  const hasMore = data.length > 5;

  return (
    <div className="p-6 rounded-2xl bg-background sticky top-20 border">
      <h2 className="font-display text-xl">Kategorie</h2>
      <div className="grid gap-2 mt-5">
        {initialCategories.map((category) => (
          <Link
            href={`/kategorie/${category.slug}`}
            key={category.id}
            className="relative overflow-hidden rounded-xl group"
          >
            <div className="p-6 flex justify-between items-center bg-black/60 z-20 relative text-white">
              <p className="font-medium">{category.name}</p>
              <ChevronRight className="size-4" />
            </div>
            <Image
              src={`/kategorie/${category.slug}.jpg`}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          </Link>
        ))}

        {/* Animated additional categories */}
        <AnimatePresence>
          {showAll && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-2"
            >
              {additionalCategories.map((category) => (
                <Link
                  href={`/kategorie/${category.slug}`}
                  key={category.id}
                  className="relative overflow-hidden rounded-xl group"
                >
                  <div className="p-6 flex justify-between items-center bg-black/60 z-20 relative text-white">
                    <p className="font-medium">{category.name}</p>
                    <ChevronRight className="size-4" />
                  </div>
                  <Image
                    src={`/kategorie/${category.slug}.jpg`}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {hasMore && (
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="mt-2 flex items-center gap-2"
          >
            {showAll ? (
              <>
                <ChevronUp className="size-4" />
                Pokaż mniej
              </>
            ) : (
              <>
                <ChevronDown className="size-4" />
                Zobacz więcej ({additionalCategories.length})
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
