"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

type BookstoryDetailProps = {
  imageUrl?: string;

  authorName: string;
  authorNickname: string;
  authorId: string | number;

  profileImgSrc?: string; // 기본: "/profile.svg"
  subscribeText?: string; // 기본: "구독"
  onSubscribeClick?: () => void;

  bookTitle: string;
  bookAuthor: string;
  bookDetail: string;

  authorHref?: string; // 기본: `/profile/${authorId}`
  className?: string;
};

export default function BookstoryDetail({
  imageUrl = "/bookstory_example.svg",
  authorName,
  authorNickname,
  authorId,
  profileImgSrc = "/profile2.svg",
  subscribeText = "구독",
  onSubscribeClick,
  bookTitle,
  bookAuthor,
  bookDetail,
  authorHref,
  className = "",
}: BookstoryDetailProps) {
  const href = authorHref ?? `/profile/${authorId}`;

  return (
    <div className={`flex w-full max-w-[1040px] p-[20px] items-start gap-[28px] bg-white ${className} `}>
      <div className="relative w-[282px] h-[344px] shrink-0">
        <Image
          src={imageUrl}
          alt={bookTitle}
          fill
          className="object-cover"
          sizes="282px"
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between self-stretch">
          <Link href={href} className="flex items-center gap-[12px] min-w-0">
            <div className="relative w-[32px] h-[32px] shrink-0 rounded-full overflow-hidden">
              <Image
                src={profileImgSrc}
                alt={authorName}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <p className="text-Gray-7 Subhead_4_1 truncate">
                {authorName}
              </p>
              <p className="text-Gray-4 Body_1_2 truncate">
                {authorNickname}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onSubscribeClick}
            className="
              flex px-[17px] py-[8px] justify-center items-center gap-[10px]
              rounded-[8px] bg-primary-2
              text-White Body_2_1 shrink-0
            "
          >
            {subscribeText}
          </button>
        </div>

        <div className="h-[16px]" />

        <div className="flex flex-col gap-[8px] min-w-0">
          <p className="text-Gray-7 Subhead_1 truncate">
            {bookTitle}
          </p>
          <p className="text-Gray-4 Subhead_4_1 truncate">
            {bookAuthor}
          </p>
          <p className="text-Gray-4 Body_1_2 line-clamp-2">
            {bookDetail}
          </p>
        </div>
      </div>
    </div>
  );
}
