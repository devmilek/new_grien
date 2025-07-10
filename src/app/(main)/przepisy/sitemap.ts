import { db } from "@/db";
import { recipes } from "@/db/schema";
import { getRecipeSlug, getS3Url } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { MetadataRoute } from "next";

export const revalidate = 60 * 60 * 24; // 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await db.query.recipes.findMany({
    limit: 50_000,
    where: eq(recipes.published, true),
    columns: {
      id: true,
      title: true,
      updatedAt: true,
    },
    with: {
      file: {
        columns: {
          key: true,
        },
      },
    },
  });

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const recipesUrls: MetadataRoute.Sitemap = data.map((recipe) => {
    return {
      url: `${BASE_URL}/przepisy/${getRecipeSlug(recipe.id, recipe.title)}`,
      lastModified: recipe.updatedAt,
      images: [getS3Url(recipe.file.key)],
    };
  });

  return recipesUrls;
}
