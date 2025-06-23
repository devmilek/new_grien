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

interface TimeInputProps {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

// Generate time options from 0 to 10 hours (600 minutes) in 15-minute intervals
const generateTimeOptions = () => {
  const options = [];
  for (let minutes = 15; minutes <= 600; minutes += 15) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    let label = "";
    if (hours === 0) {
      label = `${remainingMinutes} minut`;
    } else if (hours === 1) {
      if (remainingMinutes === 0) {
        label = "1 godzina";
      } else {
        label = `1 godzina ${remainingMinutes} minut`;
      }
    } else {
      if (remainingMinutes === 0) {
        label = `${hours} godzin`;
      } else {
        label = `${hours} godzin ${remainingMinutes} minut`;
      }
    }

    options.push({
      value: minutes,
      label: label,
    });
  }
  return options;
};

const timeOptions = generateTimeOptions();

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} minut`;
  } else if (hours === 1) {
    if (remainingMinutes === 0) {
      return "1 godzina";
    } else {
      return `1 godzina ${remainingMinutes} minut`;
    }
  } else {
    if (remainingMinutes === 0) {
      return `${hours} godzin`;
    } else {
      return `${hours} godzin ${remainingMinutes} minut`;
    }
  }
};

export const TimeInput = ({ value, onChange, disabled }: TimeInputProps) => {
  const [open, setOpen] = React.useState(false);

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
          {value ? formatTime(value) : "Wybierz czas..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Szukaj czasu..." className="h-9" />
          <CommandList>
            <CommandEmpty>Brak opcji do wyświetlenia.</CommandEmpty>
            <CommandGroup>
              {timeOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange?.(option.value === value ? 0 : option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
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
