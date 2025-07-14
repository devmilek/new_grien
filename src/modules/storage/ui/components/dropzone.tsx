"use client";

import { AlertCircleIcon, ImageUpIcon, XIcon } from "lucide-react";
import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";
import Image from "next/image";
import { useEffect } from "react";
import { MAX_FILE_SIZE, SUPPORTED_IMAGE_TYPES } from "../../config";
import { File as DbFile } from "@/db/schema/files";
import { getS3Url } from "@/lib/utils";
import { useCreateRecipe } from "@/modules/create-recipe/context/create-recipe-context";

interface FileUpload {
  value: File | null | undefined;
  onValueChange: (file: File | null) => void;
  initialImage?: DbFile | null;
}

export default function Dropzone({ onValueChange, value }: FileUpload) {
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: SUPPORTED_IMAGE_TYPES.join(","),
    maxSize: MAX_FILE_SIZE,
  });

  const { initialImage, setInitialImage } = useCreateRecipe();

  // Synchronize internal files with external value prop
  useEffect(() => {
    if (files[0]?.file && files[0].file !== value) {
      onValueChange(files[0].file as File);
    }
  }, [files, onValueChange, value]);

  // Handle file removal
  const handleRemoveFile = () => {
    if (files[0]?.id) {
      removeFile(files[0].id);
    }
    onValueChange(null);
    setInitialImage(null);
  };

  // Use prop value for preview if available, otherwise use internal files
  const previewUrl = (() => {
    if (value) return URL.createObjectURL(value);
    if (initialImage) return getS3Url(initialImage.key);
    return null;
  })();

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        {/* Drop area */}
        <div
          role="button"
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]"
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload file"
          />
          {previewUrl ? (
            <div className="absolute inset-0">
              <Image
                unoptimized
                fill
                src={previewUrl}
                alt={value?.name || files[0]?.file?.name || "Uploaded image"}
                className="size-full object-cover"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <ImageUpIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">
                Przeciągnij i upuść plik tutaj lub naciśnij
              </p>
              <p className="text-muted-foreground text-xs">
                Maksymalny rozmiar pliku: {formatBytes(MAX_FILE_SIZE)}
              </p>
            </div>
          )}
        </div>
        {previewUrl && (
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={handleRemoveFile}
              aria-label="Remove image"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
