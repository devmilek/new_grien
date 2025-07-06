import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";

export const sortBy = ["newest", "fastest", "popular"] as const;
export type SortBy = (typeof sortBy)[number];

export const useRecipesFilters = () => {
  const [category, setCategory] = useQueryState(
    "kategoria",
    parseAsString.withDefault("").withOptions({
      clearOnDefault: true,
    })
  );
  const [attributes, setAttributes] = useQueryState(
    "atrybuty",
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({
      clearOnDefault: true,
    })
  );
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsStringLiteral(sortBy).withDefault("newest").withOptions({
      clearOnDefault: true,
    })
  );
  return {
    category,
    setCategory,
    attributes,
    setAttributes,
    sort,
    setSort,
  };
};
