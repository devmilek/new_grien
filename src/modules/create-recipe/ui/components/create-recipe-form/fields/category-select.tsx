"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

interface CategorySelectProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export const CategorySelect = ({
  value,
  onChange,
  disabled,
}: CategorySelectProps) => {
  const trpc = useTRPC();
  const [open, setOpen] = React.useState(false);

  const { data } = useQuery(trpc.attributes.getCategories.queryOptions());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between font-normal", {
            "text-muted-foreground": !value,
          })}
          disabled={disabled}
        >
          {value
            ? data?.find((framework) => framework.id === value)?.name
            : "Wybierz kategorie..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Szukaj kategorii..." className="h-9" />
          <CommandList>
            <CommandEmpty>Brak kategorii do wyświetlenia.</CommandEmpty>
            <CommandGroup>
              {data?.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={(currentValue) => {
                    onChange?.(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {item.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
