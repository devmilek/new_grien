import { db } from "@/db";
import { attributes } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getAttributesByType = async (type: string) => {
  return await db.query.attributes.findMany({
    where: eq(attributes.type, type),
  });
};
