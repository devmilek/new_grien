import slugify from "@sindresorhus/slugify";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getS3Url(key: string) {
  const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!;
  return `${baseUrl}/${key}`;
}

export const getIdFromSlug = (slug: string): string | null => {
  const match = slug.match(/-([a-zA-Z0-9]{10,})$/);
  return match ? match[1] : null;
};

export const getRecipeSlug = (id: string, title: string) => {
  return `${slugify(title)}-${id}`;
};

export const getUserSlug = (id: string, username: string) => {
  return `${slugify(username)}-${id}`;
};
