"use client";

import { useParams } from "next/navigation";

import { useClubAccessGuard } from "@/hooks/useClubAccessGuard";

export default function MeetingAdminAccessLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const clubId = Number(params.id);

  const access = useClubAccessGuard({
    clubId,
    require: "member",
  });

  if (access.isCheckingAccess) {
    return <div className="w-full px-6 py-10 body_1_2 text-Gray-5">불러오는 중...</div>;
  }

  if (access.isUnauthorized) {
    return null;
  }

  if (access.isError) {
    return <div className="w-full px-6 py-10 body_1_2 text-Red">모임 정보를 불러오지 못했습니다.</div>;
  }

  return <>{children}</>;
}
