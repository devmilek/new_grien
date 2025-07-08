import { db } from "@/db";
import { Attribute, attributes } from "@/db/schema";
import { constructMetadata } from "@/lib/construct-metadata";
import { eq } from "drizzle-orm";

export const getAttribute = async (slug: string) => {
  return await db.query.attributes.findFirst({
    where: eq(attributes.slug, slug),
  });
};

const getAttributeLink = (attributeType: Attribute["type"], slug: string) => {
  switch (attributeType) {
    case "diets":
      return `/diety/${slug}`;
    case "cuisines":
      return `/kuchnie/${slug}`;
    case "occasions":
      return `/okazje/${slug}`;
    default:
      return `/atrybuty/${slug}`;
  }
};

export const generateAttributeMetadata = async (slug: string) => {
  const attribute = await getAttribute(slug);

  if (!attribute) {
    return constructMetadata({
      title: "Atrybut nie znaleziony",
      description: "Atrybut, którego szukasz, nie został znaleziony.",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: attribute.name,
    description: attribute.description,
    url: getAttributeLink(attribute.type, attribute.slug),
    canonicalUrl: getAttributeLink(attribute.type, attribute.slug),
  });
};
