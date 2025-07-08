"use client";

import { GeneratedAvatar } from "@/components/generated-avatar";
import Image from "next/image";
import React from "react";
import EditProfileDialog from "../components/edit-profile-dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { User } from "better-auth";
import { User as DbUser } from "@/db/schema";

export const UserDetailsHero = ({
  user,
  currentUser,
}: {
  user: DbUser;
  currentUser: User | null;
}) => {
  const trpc = useTRPC();

  const { data, refetch } = useSuspenseQuery(
    trpc.account.getFollowStats.queryOptions({
      userId: user.id,
    })
  );

  const { mutate: followUser, isPending: isFollowPending } = useMutation(
    trpc.account.followUser.mutationOptions({
      onSuccess: () => {
        refetch();
      },
    })
  );
  const { mutate: unfollowUser, isPending: isUnFollowPending } = useMutation(
    trpc.account.unfollowUser.mutationOptions({
      onSuccess: () => {
        refetch();
      },
    })
  );

  const handleFollowClick = () => {
    if (data.isFollowing) {
      unfollowUser({ userId: user.id });
    } else {
      followUser({ userId: user.id });
    }
  };

  const isPending = isFollowPending || isUnFollowPending;

  return (
    <div className="bg-white rounded-2xl pb-8 border">
      <div className="h-32 sm:h-48 md:h-58 w-full rounded-2xl overflow-hidden relative border">
        <Image src="/food.jpg" fill alt="Food" className="object-cover" />
      </div>
      <div className="px-4 sm:px-6 lg:px-10 -mt-8 sm:-mt-10 flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
        <GeneratedAvatar
          seed={user.name}
          className="size-20 sm:size-24 md:size-28 shadow-md"
        />
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-xl sm:text-2xl truncate">
            {user.name}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            @{user.username}
          </p>
        </div>
        <div className="w-full sm:w-auto flex items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm">
              <span className="font-medium">{data.followersCount}</span>{" "}
              obserwujących
            </span>
            <div className="w-[1px] h-5 bg-muted"></div>
            <span className="text-sm">
              <span className="font-medium">{data.followingCount}</span>{" "}
              obserwuje
            </span>
          </div>
          {currentUser?.id ? (
            user.id === currentUser.id ? (
              <EditProfileDialog />
            ) : (
              <Button
                disabled={isPending}
                className="w-full sm:w-auto"
                onClick={handleFollowClick}
                variant={data.isFollowing ? "outline" : "default"}
              >
                {data.isFollowing ? "Przestań obserwować" : "Obserwuj"}
              </Button>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};
