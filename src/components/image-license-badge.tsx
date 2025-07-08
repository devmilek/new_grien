import { Licence } from "@/db/schema";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CreativeCommons } from "lucide-react";
import Link from "next/link";
import { cn, getDomainFromUrl } from "@/lib/utils";
import { HoverCardPortal } from "@radix-ui/react-hover-card";
import { Button } from "./ui/button";

const ImageLicenseBadge = ({
  licence,
  className,
}: {
  licence: Licence;
  className?: string;
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          className={cn(
            "bg-background cursor-pointer pointer-events-auto size-6",
            className
          )}
          variant="outline"
          size="icon"
        >
          <CreativeCommons className="size-3" />
        </Button>
      </HoverCardTrigger>
      <HoverCardPortal>
        <HoverCardContent className="text-sm w-[300px] z-50">
          <p>
            Źródło: <span className="font-medium">{licence.originalTitle}</span>{" "}
            z{" "}
            <Link
              href={licence.sourceUrl}
              className="underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {getDomainFromUrl(licence.sourceUrl)}
            </Link>
          </p>
          <p>
            Licencja:{" "}
            <Link href={licence.licenseLink} className="font-medium underline">
              {licence.licenseType}
            </Link>
          </p>
          <p>
            Autor przepisu:{" "}
            <span className="font-medium">{licence.author}</span>
          </p>
          {licence.imagesAuthor && (
            <p>
              Autor zdjęcia:{" "}
              <span className="font-medium">{licence.imagesAuthor}</span>
            </p>
          )}
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCard>
  );
};

export default ImageLicenseBadge;
