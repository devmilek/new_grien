import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Label } from "../../../../components/ui/label";

export const FilterSection = ({
  title,
  items,
  selectedItems,
  onToggle,
  isMultiSelect = true,
}: {
  title: string;
  items: { id: string; slug: string; name: string }[];
  selectedItems: string | string[];
  onToggle: (slug: string, checked: boolean) => void;
  isMultiSelect?: boolean;
}) => {
  return (
    <AccordionItem value={title.toLowerCase()}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent className="grid gap-3">
        {items.map((item) => {
          const isChecked = isMultiSelect
            ? (selectedItems as string[]).includes(item.slug)
            : selectedItems === item.slug;

          return (
            <div className="flex items-center gap-3" key={item.id}>
              <Checkbox
                id={item.slug}
                checked={isChecked}
                onCheckedChange={(checked) => onToggle(item.slug, !!checked)}
              />
              <Label htmlFor={item.slug} className="cursor-pointer">
                {item.name}
              </Label>
            </div>
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
};
