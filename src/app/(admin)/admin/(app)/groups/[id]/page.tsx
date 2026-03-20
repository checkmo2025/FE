"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import TopSection from "@/components/base-ui/Admin/groups/TopItem";
import Category from "@/components/base-ui/Admin/groups/Category";
import Target from "@/components/base-ui/Admin/groups/Target";
import {
  fetchAdminClubDetail,
  type AdminClubDetail,
} from "@/lib/api/admin/clubs";

const CATEGORY_OPTIONS = [
  "여행",
  "외국어",
  "어린이/청소년",
  "종교/철학",
  "소설/시/희곡",
  "에세이",
  "인문학",
  "과학",
  "컴퓨터/IT",
  "경제/경영",
  "자기계발",
  "사회과학",
  "정치/외교/국방",
  "역사/문화",
  "예술/대중문화",
];

const TARGET_OPTIONS = [
  "대학생",
  "직장인",
  "온라인",
  "동아리",
  "모임",
  "대면",
];

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = Number(params.id);

  const [group, setGroup] = useState<AdminClubDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (Number.isNaN(groupId)) {
      setError("올바르지 않은 모임 ID입니다.");
      setLoading(false);
      return;
    }

    const loadGroupDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchAdminClubDetail(groupId);
        setGroup(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "모임 상세 정보를 불러오지 못했습니다.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadGroupDetail();
  }, [groupId]);

  if (loading) {
    return (
      <main className="w-full flex justify-center">
        <div className="w-[1040px] pt-6 pb-10 text-Gray-7 body_1_2">
          로딩 중...
        </div>
      </main>
    );
  }

  if (error || !group) {
    return (
      <main className="w-full flex justify-center">
        <div className="w-[1040px] pt-6 pb-10">
          <div className="mb-4 text-red-500 body_1_2">
            {error || "모임 정보를 찾을 수 없습니다."}
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="body_1_2 text-Gray-7 underline underline-offset-2 hover:opacity-70"
          >
            뒤로가기
          </button>
        </div>
      </main>
    );
  }

  const selectedCategorySet = new Set(
    (group.category ?? []).map((item) => item.description),
  );

  const selectedTargetSet = new Set(
    (group.participantTypes ?? []).map((item) => item.description),
  );

  const categories = CATEGORY_OPTIONS.map((label) => ({
    label,
    selected: selectedCategorySet.has(label),
  }));

  const targets = TARGET_OPTIONS.map((label) => ({
    label,
    selected: selectedTargetSet.has(label),
  }));

  const links = group.links ?? [];

  return (
    <main className="w-full flex justify-center">
      <div className="w-[1040px] pt-6 pb-10">
        <div className="flex justify-end mb-2">
          <Link
            href={`/admin/groups/${group.clubId}/members`}
            className="flex items-center gap-2 text-Gray-5 text-[14px] leading-[135%] underline underline-offset-2 hover:opacity-70"
          >
            회원 관리
            <Image
              src="/AdminUser.svg"
              alt="회원 관리"
              width={24}
              height={24}
            />
          </Link>
        </div>

        <TopSection
          groupId={group.clubId}
          name={group.name}
          intro={group.description ?? undefined}
          coverImgSrc={group.profileImageUrl ?? undefined}
        />

        <div className="mt-14">
          <Category items={categories} />
        </div>

        <div className="mt-14">
          <h2 className="text-Gray-7 text-[18px] subhead_2 leading-[135%] tracking-[-0.018px] mb-3">
            활동 지역
          </h2>

          <div className="w-full h-[48px] rounded-[8px] border border-Subbrown-4 bg-White px-4 flex items-center">
            <span className="text-Gray-7 text-[18px] font-normal leading-[135%] tracking-[-0.018px]">
              {group.region}
            </span>
          </div>
        </div>

        <div className="mt-14">
          <Target items={targets} />
        </div>

        <div className="mt-14">
          <h2 className="text-Gray-7 text-[18px] subhead_2 leading-[135%] tracking-[-0.018px] mb-3">
            링크
          </h2>

          {links.length > 0 ? (
            <div className="flex flex-col gap-4">
              {links.map((item, index) => (
                <div key={`${item.link}-${index}`} className="flex gap-4">
                  <input
                    type="text"
                    value={item.label ?? ""}
                    readOnly
                    className="flex-1 h-[56px] rounded-[8px] border border-Subbrown-4 bg-White px-4 text-[18px] outline-none"
                  />
                  <input
                    type="text"
                    value={item.link}
                    readOnly
                    className="flex-1 h-[56px] rounded-[8px] border border-Subbrown-4 bg-White px-4 text-[18px] outline-none"
                  />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="링크 대체 텍스트 입력(최대 20자)"
                  readOnly
                  className="flex-1 h-[56px] rounded-[8px] border border-Subbrown-4 bg-White px-4 text-[18px] outline-none"
                />
                <input
                  type="text"
                  placeholder="링크 입력(최대 100자)"
                  readOnly
                  className="flex-1 h-[56px] rounded-[8px] border border-Subbrown-4 bg-White px-4 text-[18px] outline-none"
                />
              </div>

              <div className="mt-4">
                <div className="w-full h-[56px] rounded-[8px] bg-Gray-1 flex items-center justify-center text-[24px] text-Gray-5">
                  +
                </div>
              </div>
            </>
          )}

          <div className="mt-20 flex justify-end">
            <button
              type="button"
              className="w-[148px] h-[48px] rounded-[8px] bg-[var(--Primary_1)] text-White text-[16px] font-normal leading-[135%] tracking-[-0.016px]"
            >
              저장하기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}