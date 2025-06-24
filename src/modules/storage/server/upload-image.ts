"use server";

import { getCurrentSession } from "@/lib/auth/get-current-session";
import { MAX_FILE_SIZE, SUPPORTED_IMAGE_TYPES } from "../config";
import { s3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import sharp from "sharp";
import { db } from "@/db";
import { files } from "@/db/schema/files";

export const uploadImage = async (formData: FormData) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      status: 401,
      message: "Musisz być zalogowany, aby przesłać obraz.",
    };
  }

  const image = formData.get("image");

  if (!image) {
    return {
      status: 400,
      message: "Brak przesłanego obrazu.",
    };
  }

  if (!(image instanceof File)) {
    return {
      status: 400,
      message: "Przesłany plik nie jest obrazem.",
    };
  }

  if (!SUPPORTED_IMAGE_TYPES.includes(image.type)) {
    return {
      status: 400,
      message: `Nieobsługiwany typ pliku. Obsługiwane typy to: ${SUPPORTED_IMAGE_TYPES.join(
        ", "
      )}.`,
    };
  }

  if (image.size > MAX_FILE_SIZE) {
    return {
      status: 400,
      message: `Plik jest za duży. Maksymalny rozmiar pliku to ${
        MAX_FILE_SIZE / (1024 * 1024)
      } MB.`,
    };
  }

  const fileKey = `${uuid()}.webp`;

  try {
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

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

    const dbImage = await db
      .insert(files)
      .values({
        name: image.name,
        key: fileKey,
        mimeType: "image/webp",
        size: optimizedBuffer.length,
      })
      .returning();

    return {
      status: 200,
      message: "Obraz został przesłany pomyślnie.",
      data: dbImage,
    };
  } catch (e) {
    console.error("Error uploading image to S3:", e);
    return {
      status: 500,
      message: "Wystąpił błąd podczas przesyłania obrazu.",
    };
  }
};
