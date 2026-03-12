import HomeBookclub from "./home_bookclub";

interface HomeClubSectionProps {
  deviceType: "mobile" | "tablet" | "desktop";
  groups: any[];
}

export default function HomeClubSection({ deviceType, groups }: HomeClubSectionProps) {
  if (deviceType === "mobile") {
    return (
      <div className="flex-1">
        <h2 className="pb-2 body_1 leading-7 text-zinc-800">독서모임</h2>
        <HomeBookclub groups={groups} />
      </div>
    );
  }

  if (deviceType === "tablet") {
    // Tablet layout note: This part is wrapped with HomeRecommendationSection in Tablet view
    return (
      <>
        <h2 className="pb-5 text-xl font-semibold leading-7 text-zinc-800">독서모임</h2>
        <HomeBookclub groups={groups} />
      </>
    );
  }

  // desktop
  return (
    <section className="w-[332px] shrink-0">
      <h2 className="pb-5 text-xl font-semibold leading-7 text-zinc-800">독서모임</h2>
      <HomeBookclub groups={groups} />
    </section>
  );
}
