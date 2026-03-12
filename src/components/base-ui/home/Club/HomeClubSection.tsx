import { MyClubInfo } from "@/types/club";
import HomeBookclub from "./home_bookclub";
import { ClubSkeleton } from "@/components/base-ui/home/shared/HomeSkeleton";

interface HomeClubSectionProps {
  groups: MyClubInfo[];
  isLoading?: boolean;
}

export default function HomeClubSection({ groups, isLoading }: HomeClubSectionProps) {
  if (isLoading) {
    return <ClubSkeleton />;
  }

  // 가독성을 위한 클래스 변수 분리
  const containerClasses = "flex-1 flex flex-col d:w-full";
  const titleClasses = "pb-2 t:pb-5 body_1 t:text-xl t:font-semibold leading-7 text-zinc-800";

  return (
    <div className={containerClasses}>
      <h2 className={titleClasses}>독서모임</h2>
      <HomeBookclub groups={groups} />
    </div>
  );
}
