"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShareIcon } from "lucide-react";
import { toast } from "sonner"; // lub inny toast

export const ShareButton = ({
  title,
  recipeId,
  description,
}: {
  title: string;
  recipeId: string;
  description: string;
}) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.href}`);
  }, [recipeId]);

  const handleShare = async () => {
    const shareData: ShareData = {
      title,
      text: description,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Błąd podczas udostępniania:", err);
        toast.error("Nie udało się udostępnić.");
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link skopiowany do schowka!");
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <ShareIcon className="w-4 h-4" />
      Udostępnij
    </Button>
  );
};
