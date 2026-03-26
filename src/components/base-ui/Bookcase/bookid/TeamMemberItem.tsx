"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  name: string;
  profileImageUrl?: string;
};

export default function TeamMemberItem({
  name,
  profileImageUrl,
}: Props) {
  return (
    <Link
      href={`/profile/${encodeURIComponent(name)}`}
      className="
        flex w-full items-center justify-between rounded-[8px] border border-Subbrown-4 bg-background px-[20px] py-[12px]
        transition-all duration-150 ease-out
        hover:-translate-y-[1px] hover:border-Subbrown-3 hover:shadow-sm hover:brightness-95
        active:translate-y-0 active:scale-[0.99]
      "
    >
      <div className="flex items-center gap-[12px]">
        <div className="relative flex h-[40px] w-[40px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-Gray-2">
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-Gray-3" />
          )}
        </div>

        <span className="subhead_4_1 text-Gray-7">{name}</span>
      </div>
    </Link>
  );
}