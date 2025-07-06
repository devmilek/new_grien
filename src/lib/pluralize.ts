export function pluralize(
  count: number,
  singular: string,
  pluralFew: string,
  pluralMany: string
) {
  if (count === 1) return `${count} ${singular}`;
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return `${count} ${pluralFew}`;
  }
  return `${count} ${pluralMany}`;
}

export function pluralizeCuisines(count: number) {
  return pluralize(count, "kuchnia", "kuchnie", "kuchni");
}
export function pluralizeDiets(count: number) {
  return pluralize(count, "dieta", "diety", "diet");
}
export function pluralizeOccasions(count: number) {
  return pluralize(count, "okazja", "okazje", "okazji");
}
export function pluralizeCategories(count: number) {
  return pluralize(count, "kategoria", "kategorie", "kategorii");
}
export function pluralizePortions(count: number) {
  return pluralize(count, "porcja", "porcje", "porcji");
}
export function pluralizeAttributes(count: number) {
  return pluralize(count, "atrybut", "atrybuty", "atrybutów");
}
export function pluralizeRecipes(count: number) {
  return pluralize(count, "przepis", "przepisy", "przepisów");
}
