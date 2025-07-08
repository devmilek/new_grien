"use client";

import React, { Fragment, useState, useCallback } from "react";
import { Dialog } from "radix-ui";
import { InputWithIcon } from "../ui/input";
import { Loader2, SearchIcon, XIcon } from "lucide-react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import Image from "next/image";
import Link from "next/link";
import { useLocalStorage, useDebounceCallback } from "usehooks-ts";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { getRecipeSlug, getS3Url } from "@/lib/utils";

interface SearchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = ({ isOpen, onOpenChange }: SearchDialogProps) => {
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.attributes.getCategories.queryOptions()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(
    "ostatnie_wyszukiwania",
    []
  );
  const router = useRouter();

  const { data: searchResults, isPending } = useQuery(
    trpc.home.searchRecipes.queryOptions(searchQuery, {
      enabled: searchQuery.length > 0,
    })
  );

  const debounced = useDebounceCallback(setSearchQuery, 300);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      debounced(value);
    },
    [debounced]
  );

  const addToRecentSearches = useCallback(
    (query: string) => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) return;

      const updatedSearches = [
        trimmedQuery,
        ...recentSearches.filter((v) => v !== trimmedQuery),
      ].slice(0, 5);

      setRecentSearches(updatedSearches);
    },
    [recentSearches, setRecentSearches]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputValue.trim()) return;

      addToRecentSearches(inputValue);
      onOpenChange(false);
      router.push(`/szukaj?query=${encodeURIComponent(inputValue.trim())}`);
    },
    [inputValue, addToRecentSearches, onOpenChange, router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit(e as React.FormEvent);
      }
    },
    [handleSubmit]
  );

  const removeFromRecentSearches = useCallback(
    (index: number) => {
      setRecentSearches((prev) => prev.filter((_, i) => i !== index));
    },
    [setRecentSearches]
  );

  const handleRecentSearchClick = useCallback(
    (query: string) => {
      onOpenChange(false);
      router.push(`/szukaj?query=${encodeURIComponent(query)}`);
    },
    [onOpenChange, router]
  );

  const handleRecipeClick = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-4 left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] gap-4 rounded-lg duration-200 sm:max-w-lg">
          <Dialog.Title className="sr-only">Wyszukaj przepisu</Dialog.Title>

          <form onSubmit={handleSubmit}>
            <InputWithIcon
              value={inputValue}
              onChange={handleInputChange}
              icon={SearchIcon}
              onKeyDown={handleKeyDown}
              className="bg-background"
              placeholder="Wyszukaj przepisu..."
              autoFocus
            />
          </form>

          <div className="bg-white w-full rounded-lg p-4 border overflow-hidden">
            {!searchQuery ? (
              <div className="space-y-5">
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="font-display text-sm font-medium mb-3">
                      Ostatnie wyszukiwania
                    </h3>
                    <div className="space-y-1">
                      {recentSearches.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted/50 group"
                        >
                          <button
                            onClick={() => handleRecentSearchClick(item)}
                            className="flex-1 text-left truncate text-sm"
                          >
                            {item}
                          </button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            onClick={() => removeFromRecentSearches(index)}
                          >
                            <XIcon className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-display text-sm font-medium mb-3">
                    Popularne kategorie
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 5).map((item) => (
                      <Link
                        href={`/kategorie/${item.slug}`}
                        key={item.id}
                        onClick={handleRecipeClick}
                        className="p-2 rounded-md text-sm font-medium border flex items-center gap-2 hover:bg-muted/50 transition-colors"
                      >
                        <Image
                          src={`/kategorie/${item.slug}.jpg`}
                          width={24}
                          height={24}
                          alt=""
                          className="size-6 object-cover rounded"
                        />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {searchResults?.map((recipe, index) => (
                  <Fragment key={recipe.id}>
                    <Link
                      href={`/przepisy/${getRecipeSlug(
                        recipe.id,
                        recipe.title
                      )}`}
                      onClick={handleRecipeClick}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <Image
                        src={getS3Url(recipe.file.key)}
                        width={40}
                        height={40}
                        alt={recipe.title}
                        className="size-10 object-cover rounded"
                      />
                      <span className="flex-1 truncate text-sm font-medium">
                        {recipe.title}
                      </span>
                    </Link>
                    {index < searchResults.length - 1 && (
                      <hr className="border-muted/30" />
                    )}
                  </Fragment>
                ))}

                {isPending && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-muted-foreground size-5" />
                  </div>
                )}

                {searchResults?.length === 0 && !isPending && (
                  <div className="text-center text-muted-foreground py-8 text-sm">
                    Brak wyników wyszukiwania
                  </div>
                )}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
