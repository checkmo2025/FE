"use client";

import React from "react";
import Image from "next/image";
import { DUMMY_USER_PROFILE } from "@/constants/mocks/mypage";
import { useProfileQuery } from "@/hooks/queries/useMemberQueries";

const AdminUserProfile = () => {
  const { data: profileData } = useProfileQuery();

  const user = {
    ...DUMMY_USER_PROFILE,
    name: profileData?.nickname || DUMMY_USER_PROFILE.name,
    intro: profileData?.description || DUMMY_USER_PROFILE.intro,
    profileImage:
      profileData?.profileImageUrl || DUMMY_USER_PROFILE.profileImage,
  };

  const email = (profileData as any)?.email || "example@email.com";
  const phone = (profileData as any)?.phone || "010-0000-0000";

  return (
    <div className="w-[479px] h-[212px]">
      <div className="grid grid-rows-[auto_1fr] h-full">
        {/* 1행 */}
        <div className="flex items-start gap-[24px]">
          {/* 프로필 이미지 */}
          <div className="w-[112px] h-[112px] rounded-full overflow-hidden relative shrink-0 bg-Subbrown-4">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-Subbrown-4" />
            )}
          </div>

          {/* 정보 영역 */}
          <dl className="grid grid-cols-[64px_1fr] gap-x-[18px] gap-y-[8px] pt-[6px]">
            <dt className="body_1_3 text-Gray-4">아이디</dt>
            <dd className="body_1_2 text-Gray-7">{user.name}</dd>

            <dt className="body_1_3 text-Gray-4">이름</dt>
            <dd className="body_1_2 text-Gray-7">윤현일</dd>

            <dt className="body_1_3 text-Gray-4">이메일</dt>
            <dd className="body_1_2 text-Gray-7">{email}</dd>

            <dt className="body_1_3 text-Gray-4">전화번호</dt>
            <dd className="body_1_2 text-Gray-7">{phone}</dd>
          </dl>
        </div>

        {/* 2행 소개글 */}
        <p className="body_1_3 text-Gray-4 leading-[145%] mt-[12px] line-clamp-3">
          {user.intro}
        </p>
      </div>
    </div>
  );
};

export default AdminUserProfile;