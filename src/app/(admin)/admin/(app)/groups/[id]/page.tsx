import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import TopSection from "@/components/base-ui/Admin/groups/TopItem";
import Category from "@/components/base-ui/Admin/groups/Category";
import Target from "@/components/base-ui/Admin/groups/Target";

type GroupDetail = {
  id: number;
  name: string;
  intro?: string | null;
  coverImgSrc?: string | null;
  region: string;
};

const DUMMY_GROUPS: GroupDetail[] = [
  {
    id: 100,
    name: "북적북적",
    intro: "모임 소개를 여기에 작성할 수 있어요.",
    coverImgSrc: "/group_cover_placeholder.svg",
    region: "홍대",
  },
  {
    id: 101,
    name: "러닝 크루",
    intro: "함께 달려요 🏃‍♂️",
    coverImgSrc: "/group_cover_placeholder.svg",
    region: "강남",
  },
];

function getGroupById(id: number) {
  return DUMMY_GROUPS.find((g) => g.id === id);
}

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const groupId = Number(id);

  if (Number.isNaN(groupId)) notFound();

  const group = getGroupById(groupId);
  if (!group) notFound();

  const categories = [
    "국내도서",
    "국내도서",
    "국내도서",
    "국내도서",
    "국내도서",
    "국내도서",
    "국내도서",
    "국내도서",
    "국내도서",
    "국내도서",
    "국내도서",
    "국내도서",
    "국내도서",
    "국내도서",
    "국내도서",
  ];

  return (
    <main className="w-full flex justify-center">
      <div className="w-[1040px] pt-6 pb-10">

        {/* 회원 관리 */}
        <div className="flex justify-end mb-2">
          <Link
            href={`/admin/groups/${group.id}/members`}
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
          groupId={group.id}
          name={group.name}
          intro={group.intro ?? undefined}
          coverImgSrc={group.coverImgSrc ?? undefined}
        />

        {/* 카테고리 */}
        <div className="mt-14">
          <Category items={categories} />
        </div>

        {/* 활동 지역 */}
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

        {/* 모임 대상 */}
        <div className="mt-14">
          <Target
            items={[
              "국내도서",
              "국내도서",
              "국내도서",
              "국내도서",
              "국내도서",
              "국내도서",
            ]}
          />
        </div>

        {/* 링크 */}
        <div className="mt-14">
          <h2 className="text-Gray-7 text-[18px] subhead_2 leading-[135%] tracking-[-0.018px] mb-3">
            링크
          </h2>

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="링크 대체 텍스트 입력(최대 20자)"
              className="flex-1 h-[56px] rounded-[8px] border border-Subbrown-4 bg-White px-4 text-[18px] outline-none"
            />
            <input
              type="text"
              placeholder="링크 입력(최대 100자)"
              className="flex-1 h-[56px] rounded-[8px] border border-Subbrown-4 bg-White px-4 text-[18px] outline-none"
            />
          </div>

          <div className="mt-4">
            <div className="w-full h-[56px] rounded-[8px] bg-Gray-1 flex items-center justify-center text-[24px] text-Gray-5">
              +
            </div>
          </div>

          {/* 저장하기 버튼 */}
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