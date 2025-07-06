import Image from "next/image";
import React from "react";

interface RecipesListHeroProps {
  heading: string;
  subheading: string;
  imageUrl: string;
}

export const RecipesListHero = ({
  heading,
  imageUrl,
  subheading,
}: RecipesListHeroProps) => {
  return (
    <div className="relative h-96 rounded-2xl overflow-hidden mb-6">
      <div className="absolute z-20 bg-black/60 size-full flex items-center justify-center flex-col text-white">
        <h1 className="font-display text-4xl">{heading}</h1>
        <p className="mt-1">{subheading}</p>
      </div>
      <Image
        src={imageUrl}
        alt="Category Image"
        fill
        className="object-cover z-10"
      />
    </div>
  );
};
