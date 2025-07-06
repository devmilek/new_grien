import {
  createLoader,
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";
import { sortBy } from "./hooks/use-recipes-filters";

export const recipesFilteringParams = {
  atrybuty: parseAsArrayOf(parseAsString).withDefault([]).withOptions({
    clearOnDefault: true,
  }),
  sort: parseAsStringLiteral(sortBy).withDefault("newest").withOptions({
    clearOnDefault: true,
  }),
  kategoria: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
};

export const loadRecipesSearchParams = createLoader(recipesFilteringParams);
