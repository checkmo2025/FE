import { RecommendedMember } from "@/types/member";
import ListSubscribeLarge from "./list_subscribe_large";

interface HomeRecommendationSectionProps {
  users: RecommendedMember[];
  isError: boolean;
  isLoading?: boolean;
  onProfileClick?: (nickname: string) => void;
  onSubscribeClick: (nickname: string, isFollowing: boolean) => void;
}

export default function HomeRecommendationSection({
  users,
  isError,
  isLoading,
  onProfileClick,
  onSubscribeClick,
}: HomeRecommendationSectionProps) {
  // 로딩/에러/빈 상태 처리는 ListSubscribeLarge 내부 로직으로 일원화
  return (
    <ListSubscribeLarge
      height="h-[424px] d:h-[380px]"
      users={users}
      isError={isError}
      isLoading={isLoading}
      onProfileClick={onProfileClick}
      onSubscribeClick={onSubscribeClick}
    />
  );
}
