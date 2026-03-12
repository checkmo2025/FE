import ListSubscribeElement from "./list_subscribe_element";
import ListSubscribeLarge from "./list_subscribe_large";
import { RecommendationSkeleton } from "../shared/HomeSkeleton";

interface HomeRecommendationSectionProps {
  users: any[];
  isError: boolean;
  isLoading?: boolean;
  onSubscribeClick: (nickname: string, isFollowing: boolean) => void;
}

export default function HomeRecommendationSection({
  users,
  isError,
  isLoading,
  onSubscribeClick,
}: HomeRecommendationSectionProps) {
  if (isLoading) {
    return <RecommendationSkeleton />;
  }

  const mobileTitleClasses = "pb-2 body_1 leading-7 text-zinc-800";

  return (
    <>
      {/* 모바일 버전 */}
      <div className="t:hidden flex-1">
        <h2 className={mobileTitleClasses}>사용자 추천</h2>
        <div className="flex flex-col gap-3">
          {isError ? (
            <div className="flex flex-1 items-center justify-center py-4">
              <p className="text-Gray-4 text-[14px]">추천 목록을 불러오지 못했어요.</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-4">
              <p className="text-Gray-4 text-[14px]">사용자 추천이 없습니다.</p>
            </div>
          ) : (
            users.slice(0, 3).map((u) => (
              <ListSubscribeElement
                key={u.nickname}
                name={u.nickname}
                profileSrc={u.profileImageUrl}
                isFollowing={u.isFollowing}
                onSubscribeClick={() => onSubscribeClick(u.nickname, u.isFollowing)}
              />
            ))
          )}
        </div>
      </div>

      {/* 태블릿 & 데스크톱 버전 */}
      <div className="hidden t:block">
        <ListSubscribeLarge
          height="h-[424px] d:h-[380px]"
          users={users}
          isError={isError}
          onSubscribeClick={onSubscribeClick}
        />
      </div>
    </>
  );
}
