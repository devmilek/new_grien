import { createAvatar } from "@dicebear/core";
import { notionists } from "@dicebear/collection";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { BadgeCheckIcon } from "lucide-react";

interface GeneratedAvatarProps {
  seed: string;
  className?: string;
  verified?: boolean;
}

export const GeneratedAvatar = ({
  seed,
  className,
  verified = false,
}: GeneratedAvatarProps) => {
  const avatar = createAvatar(notionists, {
    seed,
    backgroundColor: ["ffffff"],
  });

  return (
    <div className="relative">
      <Avatar className={cn("border", className)}>
        <AvatarImage src={avatar.toDataUri()} alt="Avatar" />
        <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      {verified && (
        <BadgeCheckIcon className="absolute size-4 -top-1 -right-1 text-blue-600" />
      )}
    </div>
  );
};
