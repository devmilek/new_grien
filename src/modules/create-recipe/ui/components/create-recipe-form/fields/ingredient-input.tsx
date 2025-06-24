"use client";

import {
  Combobox,
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLoading,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import { useDebounceCallback } from "usehooks-ts";

interface IngredientInputProps {
  value?: {
    id: string;
    alias: string;
  };
  onChange?: (value: { id: string; alias: string }) => void;
  disabled?: boolean;
}

export const IngredientInput = ({
  disabled,
  onChange,
  value,
}: IngredientInputProps) => {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  const trpc = useTRPC();

  const { data, isLoading } = useQuery(
    trpc.createRecipe.searchIngredients.queryOptions({
      query: debouncedSearch,
    })
  );

  const debounced = useDebounceCallback(setDebouncedSearch, 300);

  return (
    <Combobox
      value={value?.id}
      onValueChange={(val) => {
        onChange?.({
          id: val,
          alias: data?.find((item) => item.id === val)?.alias || "",
        });
      }}
      inputValue={search}
      onInputValueChange={(val) => {
        debounced(val);
        setSearch(val);
      }}
      manualFiltering
    >
      <ComboboxAnchor>
        <ComboboxInput className="capitalize" />
        <ComboboxTrigger>
          <ChevronDown className="h-4 w-4" />
        </ComboboxTrigger>
      </ComboboxAnchor>
      <ComboboxContent>
        {isLoading ? (
          <ComboboxLoading label="Wyszukiwanie składników..." />
        ) : null}
        <ComboboxEmpty keepVisible={!isLoading && data?.length === 0}>
          Nie znaleziono składników
        </ComboboxEmpty>
        {!isLoading &&
          data?.map((item) => (
            <ComboboxItem
              key={item.id}
              value={item.id}
              outset
              className="capitalize"
            >
              {item.alias}
            </ComboboxItem>
          ))}
      </ComboboxContent>
    </Combobox>
  );
};
