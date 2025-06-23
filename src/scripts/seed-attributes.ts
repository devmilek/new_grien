import {
  AttributeInsert,
  attributes,
  AttributeType,
  categories,
} from "@/db/schema";
import { data } from "./data/attributes";
import slugify from "@sindresorhus/slugify";
import { db } from "@/db";

// Helper function to create attribute batches
const createAttributeBatch = (
  items: Array<{ name: string; description: string }>,
  type: AttributeType
): AttributeInsert[] =>
  items.map((item) => ({
    name: item.name,
    slug: slugify(item.name),
    type,
    description: item.description,
  }));

export const seedAttributes = async () => {
  console.log("Seeding attributes...");

  try {
    // Prepare categories batch
    const categoriesBatch = data.categories.map((category) => ({
      name: category.name,
      slug: slugify(category.name),
      description: category.description,
    }));

    // Prepare attribute batches using helper function
    const attributeBatches = [
      ...createAttributeBatch(data.occasions, "occasions"),
      ...createAttributeBatch(data.cuisines, "cuisines"),
      ...createAttributeBatch(data.diets, "diets"),
    ];

    // Use transaction for data consistency
    await db.transaction(async (tx) => {
      // Insert categories first
      await tx.insert(categories).values(categoriesBatch);
      console.log(`✓ Inserted ${categoriesBatch.length} categories`);

      // Insert attributes in batches for better performance
      const BATCH_SIZE = 100;
      for (let i = 0; i < attributeBatches.length; i += BATCH_SIZE) {
        const batch = attributeBatches.slice(i, i + BATCH_SIZE);
        await tx.insert(attributes).values(batch);
      }
      console.log(`✓ Inserted ${attributeBatches.length} attributes`);
    });

    console.log("✅ Attributes seeded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding attributes:", error);
    throw error;
  }
};

seedAttributes();
