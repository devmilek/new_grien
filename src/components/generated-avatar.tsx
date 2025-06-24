import { createAvatar } from "@dicebear/core";
import { notionists } from "@dicebear/collection";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

interface GeneratedAvatarProps {
  seed: string;
  className?: string;
}

export const GeneratedAvatar = ({ seed, className }: GeneratedAvatarProps) => {
  const avatar = createAvatar(notionists, {
    seed,
    backgroundColor: ["ffffff"],
  });

  return (
    <Avatar className={cn("border", className)}>
      <AvatarImage src={avatar.toDataUri()} alt="Avatar" />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
