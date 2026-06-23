"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { MyClubInfo } from "@/types/club";
import { useAuthStore } from "@/store/useAuthStore";
import Mybookclub from "@/components/base-ui/Group-Search/search_mybookclub";

interface HomeClubSectionProps {
  groups: MyClubInfo[];
  isLoading?: boolean;
}

export default function HomeClubSection({ groups, isLoading }: HomeClubSectionProps) {
  const router = useRouter();
  const { isLoggedIn, openLoginModal } = useAuthStore();

  // MyClubInfo[] → Mybookclub 가 받는 { id, name } 형태로 매핑
  const myGroups = groups.map((c) => ({ id: String(c.clubId), name: c.clubName }));

  const handleSearchGroup = () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    router.push("/groups");
  };

  const handleCreateGroup = () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    router.push("/groups/create");
  };

  // 가독성을 위한 클래스 변수 분리
  // 태블릿에서는 늘리지 않고 책이야기 카드와 동일한 336px 고정폭(2열 가운데 정렬 매칭)
  const containerClasses = "flex flex-col w-full t:w-[336px] d:w-full";
  const titleClasses = "pb-2 t:pb-5 body_1 t:text-xl t:font-semibold leading-7 text-zinc-800";

  // Mybookclub 에는 검색/생성 버튼이 없으므로 홈에서는 박스 내부(footer)에 노출 (항상 표시)
  const clubButtons = (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleSearchGroup}
        className="w-full h-[32px] t:h-[48px] py-3 rounded-[8px] bg-white border border-[#E6E6E6]
                  text-[13px] flex items-center justify-center gap-2 cursor-pointer"
      >
        <Image
          src="/search.svg"
          alt="모임 검색하기"
          width={24}
          height={24}
          className="w-3.5 h-3.5 t:w-6 t:h-6"
        />
        <span className="text-primary-3 body_1_2 t:subhead_4_1">모임 검색하기</span>
      </button>

      <button
        type="button"
        onClick={handleCreateGroup}
        className="w-full h-[32px] t:h-[48px] py-3 rounded-[6px] bg-[#6B5448] text-white
                  text-[13px] flex items-center justify-center gap-2 cursor-pointer"
      >
        <Image
          src="/icon_plus.svg"
          alt="icon_plus"
          width={24}
          height={24}
          className="w-3.5 h-3.5 t:w-6 t:h-6"
        />
        <span className="text-color-white body_1_2 t:subhead_4_1">모임 생성하기</span>
      </button>
    </div>
  );

  return (
    <div className={containerClasses}>
      <h2 className={titleClasses}>독서모임</h2>

      <Mybookclub groups={myGroups} isLoading={isLoading} footer={clubButtons} />
    </div>
  );
}
