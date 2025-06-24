// import ingredients.txt file from './data/ingredients.txt';

import { readFileSync } from "fs";
import { join } from "path";
import slugify from "@sindresorhus/slugify";
import { db } from "@/db";
import { ingredientAliases, ingredients } from "@/db/schema/ingredients";

const ingredientsFilePath = join(__dirname, "data", "ingredients.txt");
const ingredientsContent = readFileSync(ingredientsFilePath, "utf-8");

// find all lines that start with 'pl'

const lines = ingredientsContent
  .split("\n")
  .filter((line) => line.startsWith("pl"));

console.log(`Total lines starting with 'pl': ${lines.length}`);

// get all words in the lines wihout pl word
// pl: Margaryna, margaryny

let mainWords = 0;

const processLines = async () => {
  for (const line of lines) {
    const parts = line.split(":");
    if (parts.length > 1) {
      const words = parts[1]
        ?.split(",")
        .map((word) => word.trim())
        .filter((word) => word.length > 0);

      if (words && words.length > 0) {
        const mainWord = words[0];
        const otherWords = words.slice(1);

        if (!mainWord) continue;

        console.log(
          `Słowo główne: '${mainWord}'. Pozostałe słowa: "${otherWords.join(
            ", "
          )}".`
        );

        const [ingredient] = await db
          .insert(ingredients)
          .values({
            name: mainWord,
            slug: slugify(mainWord),
          })
          .onConflictDoNothing()
          .returning();

        if (!ingredient) {
          console.error(`Failed to insert ingredient: ${mainWord}`);
          continue;
        }

        // Add primary alias (main word)
        await db
          .insert(ingredientAliases)
          .values({
            alias: mainWord,
            ingredientId: ingredient.id,
            isPrimary: true,
          })
          .onConflictDoNothing();

        // Add other words as aliases
        for (const otherWord of otherWords) {
          await db
            .insert(ingredientAliases)
            .values({
              alias: otherWord,
              ingredientId: ingredient.id,
              isPrimary: false,
            })
            .onConflictDoNothing();
        }

        mainWords++;
      }
    }
  }
};

await processLines();

console.log(`Total main words: ${mainWords}`);

process.exit(0);
