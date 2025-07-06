"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterIcon } from "lucide-react";
import React from "react";
import {
  SortBy,
  sortBy,
  useRecipesFilters,
} from "../../hooks/use-recipes-filters";
import { Badge } from "@/components/ui/badge";

export const SortButton = () => {
  const { sort, setSort } = useRecipesFilters();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <FilterIcon />
          Sortuj
          <Badge variant="secondary">
            {sort === "newest" && "Najnowsze"}
            {sort === "fastest" && "Najszybsze"}
            {sort === "popular" && "Najpopularniejsze"}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={sort}
          onValueChange={(val) => setSort(val as SortBy)}
        >
          {sortBy.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {option === "newest" && "Najnowsze"}
              {option === "fastest" && "Najszybsze"}
              {option === "popular" && "Najpopularniejsze"}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
