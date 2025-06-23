import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { difficulties } from "@/db/schema";
import { formatDifficulty } from "@/lib/formatters";

interface DifficultySelectProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export const DifficultySelect = ({
  disabled,
  onChange,
  value,
}: DifficultySelectProps) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Wybierz poziom trudności..." />
      </SelectTrigger>
      <SelectContent>
        {difficulties.map((difficulty) => (
          <SelectItem
            value={difficulty}
            key={difficulty}
            className="capitalize"
          >
            {formatDifficulty(difficulty)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
