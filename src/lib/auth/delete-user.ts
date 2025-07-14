import { db } from "@/db";
import { files } from "@/db/schema";
import { User } from "better-auth";
import { eq } from "drizzle-orm";
import { s3 } from "../s3";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";

export const beforeDeleteUser = async ({ user }: { user: User }) => {
  try {
    const images = await db.query.files.findMany({
      where: eq(files.uploadedBy, user.id),
      columns: {
        id: true,
        key: true,
      },
    });

    if (images.length === 0) {
      console.log(`No files found for user ${user.id}`);
      return;
    }

    console.log(`Deleting ${images.length} files for user ${user.id}`);

    const batchSize = 1000;
    for (let i = 0; i < images.length; i += batchSize) {
      const batch = images.slice(i, i + batchSize);

      try {
        await s3.send(
          new DeleteObjectsCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Delete: {
              Objects: batch.map((image) => ({
                Key: image.key,
              })),
              Quiet: true,
            },
          })
        );

        console.log(
          `Deleted batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(images.length / batchSize)}`
        );
      } catch (s3Error) {
        console.error(
          `Error deleting S3 batch ${Math.floor(i / batchSize) + 1}:`,
          s3Error
        );
      }
    }

    const deletedCount = await db
      .delete(files)
      .where(eq(files.uploadedBy, user.id));
    console.log(
      `Deleted ${deletedCount} file records from database for user ${user.id}`
    );
  } catch (error) {
    console.error("Error in beforeDeleteUser:", error);
    throw new Error(
      `Failed to delete user files: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};
