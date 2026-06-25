"use client";

import React from "react";
import Image from "next/image";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/images";
import { isValidUrl } from "@/utils/url";

type AdminUserProfileProps = {
  user: {
    userId: string;
    name: string;
    intro: string;
    profileImage?: string | null;
    email?: string | null;
    phone?: string | null;
  };
};

const AdminUserProfile = ({ user }: AdminUserProfileProps) => {
  const email = user.email ?? "example@email.com";
  const phone = user.phone ?? "010-0000-0000";

  return (
    <div className="w-[479px] h-[212px]">
      <div className="grid grid-rows-[auto_1fr] h-full">
        <div className="flex items-start gap-[24px]">
          <div className="w-[112px] h-[112px] rounded-full overflow-hidden relative shrink-0 bg-Subbrown-4">
            <Image
              src={isValidUrl(user.profileImage) ? user.profileImage : DEFAULT_PROFILE_IMAGE}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>

          <dl className="grid grid-cols-[64px_1fr] gap-x-[18px] gap-y-[8px] pt-[6px]">
            <dt className="body_1_3 text-Gray-4">아이디</dt>
            <dd className="body_1_2 text-Gray-7">{user.userId}</dd>

            <dt className="body_1_3 text-Gray-4">이름</dt>
            <dd className="body_1_2 text-Gray-7">{user.name}</dd>

            <dt className="body_1_3 text-Gray-4">이메일</dt>
            <dd className="body_1_2 text-Gray-7">{email}</dd>

            <dt className="body_1_3 text-Gray-4">전화번호</dt>
            <dd className="body_1_2 text-Gray-7">{phone}</dd>
          </dl>
        </div>

        <p className="body_1_3 text-Gray-4 leading-[145%] mt-[12px] line-clamp-3">
          {user.intro}
        </p>
      </div>
    </div>
  );
};

export default AdminUserProfile;