import { openai } from "@/lib/openai";
import { z } from "zod/v4";
import { zodResponseFormat } from "openai/helpers/zod";
import {
  ParsedIngredientSchema,
  ParsedRecipeSchema,
  parseRecipeSchema,
} from "./schemas";
import { db } from "@/db";
import Fuse from "fuse.js";
import removeAccents from "remove-accents";
import sharp from "sharp";
import { s3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 } from "uuid";
import slugify from "@sindresorhus/slugify";
import { mkdir } from "fs/promises";
import path from "path";
import "dotenv/config";

const categories = await db.query.categories.findMany();
const attributes = await db.query.attributes.findMany();
const ingredientAliases = await db.query.ingredientAliases.findMany();

const fuse = new Fuse(ingredientAliases, {
  keys: ["searchKey"],
  threshold: 0.3,
  isCaseSensitive: false,
  useExtendedSearch: true,
});

const main = async () => {
  while (true) {
    const imageUrlInput = prompt("Enter recipe image URL");
    const validatedData = z.url().safeParse(imageUrlInput);

    if (!validatedData.success) {
      console.error("Invalid URL. Please try again.");
      continue;
    }

    const imageUrl = validatedData.data;

    // TODO: save image to R2, and database
    // download image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error("Failed to download image. Please try again.");
      continue;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const id = v4();
    const fileKey = `/generated/${id}.webp`;

    const optimizedBuffer = await sharp(buffer)
      .resize(1920, 1080, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 85,
        effort: 4,
      })
      .toBuffer();

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: fileKey,
        Body: optimizedBuffer,
        ContentType: "image/webp",
        CacheControl: "max-age=31536000",
      })
    );

    const recipeDescriptionInput = prompt("Enter recipe description");
    const validatedDescription = z
      .string()
      .max(500)
      .safeParse(recipeDescriptionInput);

    if (!validatedDescription.success) {
      console.error("Invalid description. Please try again.");
      continue;
    }

    const recipeDescription = validatedDescription.data;

    const attributesSlugs = attributes.map((attr) => attr.slug);
    const categoriesSlugs = categories.map((cat) => cat.slug);

    const completion = await openai.chat.completions.parse({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `Jesteś doświadczonym szefem kuchni i dietetykiem. Na podstawie krótkiego opisu potrawy wygeneruj kompletny, szczegółowy przepis w języku polskim.
  Wymagania:
  • Podawaj składniki w kolejności użycia, każdemu przypisz ilość oraz jednostkę w systemie metrycznym.
  • Instrukcje przygotowania wypunktuj w punktach, zachowując chronologię.
  • Określ liczbę porcji, łączny czas przygotowania (prep_time) oraz czas obróbki cieplnej (cook_time) w minutach.
  • Ustal stopień trudności: łatwy, średni lub trudny.
  • Dobierz category_slugs i attribute_slugs **wyłącznie** z poniższych list i zwróć tylko najlepiej pasujące — pomiń, jeśli brak dopasowania.
  • Odpowiadaj **wyłącznie** w formacie JSON zgodnym ze schematem \"recipe\" dostarczonym przez API. Bez dodatkowego tekstu.
  `,
        },
        {
          role: "user",
          content: `Opis potrawy: ${recipeDescription}`,
        },
      ],
      response_format: zodResponseFormat(
        parseRecipeSchema({
          attributes: attributesSlugs,
          categories: categoriesSlugs,
        }),
        "recipe"
      ),
    });

    const recipeData = completion.choices[0].message.parsed;

    if (!recipeData) {
      console.error("Failed to parse recipe data. Please try again.");
      continue;
    }

    const ingredients: ParsedIngredientSchema[] = recipeData.ingredients.map(
      (ingredient) => {
        const unaccent = removeAccents(ingredient.name || "")
          .toLowerCase()
          .split(/\s+/)
          .map((w) => `'${w}`)
          .join(" ");

        const values = fuse.search(unaccent);

        const alias = values.length > 0 ? values[0].item : null;

        if (!alias) {
          console.warn(
            `No alias found for ingredient: ${ingredient.name}. Using default name.`
          );
        }

        return {
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          aliasName: alias?.alias ?? undefined,
          searchKey: alias?.searchKey ?? undefined, // This now converts null to undefined
          aliasId: alias?.id ?? undefined,
        };
      }
    );

    const recipe: ParsedRecipeSchema = {
      title: recipeData.title,
      slug: slugify(recipeData.title),
      description: recipeData.description,
      category: recipeData.category,
      difficulty: recipeData.difficulty,
      portions: recipeData.portions,
      preparationTime: recipeData.preparationTime,
      ingredients: ingredients,
      steps: recipeData.steps,
      attributes: recipeData.attributes,
      imageUrl: imageUrl,
      rawDescription: recipeDescription,
      fileKey: fileKey,
    };

    const outputDir = "./rawRecipe";
    const outputFile = path.join(outputDir, `${recipe.slug}.json`);
    await mkdir(outputDir, { recursive: true });
    await Bun.write(outputFile, JSON.stringify(recipe, null, 2));

    console.log(`Recipe saved to ${outputFile}`);
    // save to json file
  }
};

main();
