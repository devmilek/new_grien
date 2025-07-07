import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { FilterIcon } from "lucide-react";
import React from "react";
import { FacetedSearch } from "./faceted-search";

export const MobileFacatedSearch = ({ className }: { className?: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className={cn(className)}>
          <FilterIcon />
          Filtruj
        </Button>
      </SheetTrigger>
      <SheetContent className="p-4" side="left">
        <FacetedSearch />
      </SheetContent>
    </Sheet>
  );
};
