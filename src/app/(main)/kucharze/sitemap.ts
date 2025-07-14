import { db } from "@/db";
import { getUserSlug } from "@/lib/utils";
import { MetadataRoute } from "next";

export const revalidate = 604_800; // 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await db.query.users.findMany({
    limit: 50_000,
    columns: {
      id: true,
      username: true,
      updatedAt: true,
    },
  });

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const usersUrls: MetadataRoute.Sitemap = data.map((user) => {
    return {
      url: `${BASE_URL}/kucharze/${getUserSlug(user.id, user.username)}`,
      lastModified: user.updatedAt,
    };
  });

  return usersUrls;
}
