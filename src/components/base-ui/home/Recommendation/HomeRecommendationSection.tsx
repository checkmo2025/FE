import { RecommendedMember } from "@/types/member";
import ListSubscribeLarge from "./list_subscribe_large";

interface HomeRecommendationSectionProps {
  users: RecommendedMember[];
  isError: boolean;
  isLoading?: boolean;
  onProfileClick?: (nickname: string) => void;
  onSubscribeClick: (nickname: string, isFollowing: boolean) => void;
}

// 독서모임(HomeClubSection) 제목과 동일한 스타일 — 제목을 박스 밖 위에 두고 글자 크기도 통일
const titleClasses = "pb-2 t:pb-5 body_1 t:text-xl t:font-semibold leading-7 text-zinc-800";

export default function HomeRecommendationSection({
  users,
  isError,
  isLoading,
  onProfileClick,
  onSubscribeClick,
}: HomeRecommendationSectionProps) {
  // 로딩/에러/빈 상태 처리는 ListSubscribeLarge 내부 로직으로 일원화
  return (
    <div className="flex flex-col w-full t:w-[336px]">
      <h2 className={titleClasses}>사용자 추천</h2>
      <ListSubscribeLarge
        height="h-auto"
        users={users}
        isError={isError}
        isLoading={isLoading}
        hideTitle
        onProfileClick={onProfileClick}
        onSubscribeClick={onSubscribeClick}
      />
    </div>
  );
}
