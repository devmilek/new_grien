"use client";

import {
  BoltIcon,
  BookIcon,
  BookOpenIcon,
  ChevronDownIcon,
  FilePlus2Icon,
  Layers2Icon,
  LogOutIcon,
  UserPenIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient, getErrorMessage } from "@/lib/auth/auth-client";
import { GeneratedAvatar } from "../generated-avatar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const UserMenu = () => {
  const { data } = authClient.useSession();
  const router = useRouter();

  if (!data) {
    return null;
  }

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onError: ({ error }) => {
          if (error.code) {
            toast.error(getErrorMessage(error.code));
          } else {
            toast.error("Wystąpił błąd podczas wylogowywania.");
          }
        },
        onSuccess: () => {
          toast.success("Pomyślnie wylogowano.");
          router.refresh();
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent group"
        >
          <GeneratedAvatar seed={data?.user.name} />
          <ChevronDownIcon
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {data?.user.name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            @{data?.user.username}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Option 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Layers2Icon size={16} className="opacity-60" aria-hidden="true" />
            <span>Option 2</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BookOpenIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Option 3</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/utworz-przepis">
              <FilePlus2Icon
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Utwórz przepis</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/konto/przepisy">
              <BookIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Zarządzaj przepisami</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserPenIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Option 5</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Wyloguj się</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
