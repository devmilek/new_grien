import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getS3Url(key: string) {
  const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!;
  return `${baseUrl}/${key}.webp`;
}
