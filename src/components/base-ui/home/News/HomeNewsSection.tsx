import NewsBannerSlider from "./NewsBannerSlider";

interface HomeNewsSectionProps {
  deviceType: "mobile" | "tablet" | "desktop";
}

export default function HomeNewsSection({ deviceType }: HomeNewsSectionProps) {
  if (deviceType === "mobile") {
    return (
      <section className="pt-6">
        <h2 className="pb-4 body_1 leading-7 text-zinc-800">소식</h2>
        <NewsBannerSlider />
      </section>
    );
  }

  if (deviceType === "tablet") {
    return (
      <section className="pt-6">
        <h2 className="pb-5 text-xl font-semibold leading-7 text-zinc-800">소식</h2>
        <NewsBannerSlider />
      </section>
    );
  }

  // desktop
  return (
    <section className="flex-1">
      <h2 className="pb-5 text-xl font-semibold leading-7 text-zinc-800">소식</h2>
      <NewsBannerSlider />
    </section>
  );
}
