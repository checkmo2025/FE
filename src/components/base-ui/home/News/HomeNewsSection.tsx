import NewsBannerSlider from "./NewsBannerSlider";
import { NewsSkeleton } from "@/components/base-ui/home/shared/HomeSkeleton";

interface HomeNewsSectionProps {
  isLoading?: boolean;
}

export default function HomeNewsSection({ isLoading }: HomeNewsSectionProps) {
  if (isLoading) {
    return <NewsSkeleton />;
  }

  // 가독성을 위한 클래스 변수 분리
  const sectionClasses = "pt-6 d:pt-0 d:flex-1";
  const titleClasses = "pb-4 t:pb-5 body_1 t:text-xl t:font-semibold leading-7 text-zinc-800";

  return (
    <section className={sectionClasses}>
      <h2 className={titleClasses}>소식</h2>
      <NewsBannerSlider />
    </section>
  );
}
