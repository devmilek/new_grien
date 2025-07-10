import { db } from "@/db";
import { AttributeType } from "@/db/schema";
import { MetadataRoute } from "next";

export const revalidate = 60 * 60 * 24 * 7; // 24 hours

const getAttributePath = (type: AttributeType) => {
  switch (type) {
    case "cuisines":
      return "kuchnie-swiata";
    case "diets":
      return "diety";
    case "occasions":
      return "okazje";
  }
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      priority: 1,
    },
  ];

  const categories = await db.query.categories.findMany({
    limit: 50_000,
    columns: {
      slug: true,
    },
  });

  const categoriesUrls: MetadataRoute.Sitemap = categories.map((category) => {
    return {
      url: `${BASE_URL}/kategorie/${category.slug}`,
      lastModified: new Date(),
    };
  });

  const attribtues = await db.query.attributes.findMany({
    limit: 50_000,
    columns: {
      slug: true,
      type: true,
    },
  });

  const attributesUrls: MetadataRoute.Sitemap = attribtues.map((attr) => {
    return {
      url: `${BASE_URL}/${getAttributePath(attr.type)}/${attr.slug}`,
      lastModified: new Date(),
    };
  });

  return [...urls, ...categoriesUrls, ...attributesUrls];
}
