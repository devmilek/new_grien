"use client";

import { AtSignIcon, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputWithIcon } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useForm } from "react-hook-form";
import { editProfileSchema, EditProfileSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { authClient, getErrorMessage } from "@/lib/auth/auth-client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EditProfileDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const form = useForm<EditProfileSchema>({
    defaultValues: {
      name: data?.user.name || "",
      username: data?.user.username || "",
      bio: data?.user.bio || "",
    },
    resolver: zodResolver(editProfileSchema),
  });

  useEffect(() => {
    if (data?.user) {
      form.reset({
        name: data.user.name || "",
        username: data.user.username || "",
        bio: data.user.bio || "",
      });
    }
  }, [data, form]);

  const name = form.watch("name");

  const onSubmit = async (values: EditProfileSchema) => {
    await authClient.updateUser(
      {
        username:
          data?.user.username === values.username ? undefined : values.username,
        name: values.name,
        bio: values.bio,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          form.reset();
          toast.success("Profil został zaktualizowany");
          router.refresh();
        },
        onError: ({ error }) => {
          console.log(error.code);
          toast.error(getErrorMessage(error.code));
        },
      }
    );
  };

  const isLoading = form.formState.isSubmitting || isPending;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen((prev) => !prev);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Edytuj profil</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Edytuj profil
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Możesz zmienić swoje dane, takie jak imię, nazwisko czy nazwa
          użytkownika.
        </DialogDescription>
        <Form {...form}>
          <div className="overflow-y-auto">
            {/* <ProfileBg /> */}
            <div className="h-32 relative">
              <Image src="/food.jpg" fill alt="Food" className="object-cover" />
            </div>
            <div className="-mt-10 px-6">
              <GeneratedAvatar seed={name} className="size-20" />
            </div>
            <div className="px-6 pt-4 pb-6">
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imię</FormLabel>
                      <FormControl>
                        <InputWithIcon
                          icon={User}
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nazwa użytkownika</FormLabel>
                      <FormControl>
                        <InputWithIcon
                          icon={AtSignIcon}
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="bio"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Napisz kilka zdań o sobie"
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </div>
          </div>
        </Form>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>
              Anuluj
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin" />}
            Zapisz zmiany
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
