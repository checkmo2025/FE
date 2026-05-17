import Image from "next/image";
import DesktopMockup from "./shared/DesktopMockup";

export default function LandingClubSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 t:py-28">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10 px-6 d:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="body_2_1 text-primary-2">독서 모임 / Club</span>
          <h2 className="subhead_1 text-Gray-7 t:headline_3 t:max-w-[600px]">
            다양한 독서모임에 직접 참여하거나,
            <br />
            원하는 독서모임을 직접 만들 수 있어요.
          </h2>
          <p className="body_1_2 text-Gray-5">
            어떤 책이든, 어떤 장르든 취향에 맞는 모임을 찾거나 새로운 모임을 직접 만들어보세요.
          </p>
        </div>

        <div className="relative w-full">
          <div className="absolute -left-10 top-1/2 hidden -translate-y-1/2 rotate-[-8deg] opacity-70 t:block">
            <Image src="/booksample.svg" alt="" width={80} height={120} />
          </div>
          <div className="absolute -right-10 top-1/3 hidden -translate-y-1/2 rotate-[10deg] opacity-70 t:block">
            <Image src="/booksample.svg" alt="" width={70} height={105} />
          </div>
          <div className="absolute -right-4 bottom-8 hidden rotate-[-5deg] opacity-50 t:block">
            <Image src="/booksample.svg" alt="" width={55} height={82} />
          </div>

          <DesktopMockup variant="club" />
        </div>
      </div>
    </section>
  );
}
