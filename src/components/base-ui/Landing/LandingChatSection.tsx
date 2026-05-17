import Link from "next/link";
import Image from "next/image";

const FEATURES = [
  {
    title: "한줄 비평",
    desc: "읽은 책에 대한 짧고 강렬한 한 줄 비평을 남기고 다른 독자들의 생각도 확인해보세요.",
    icon: "/icons_pencil.svg",
  },
  {
    title: "발제 작성 및 선택",
    desc: "토론 주제를 직접 작성하고, 모임원들과 함께 오늘의 발제를 선택해보세요.",
    icon: "/Document.svg",
  },
  {
    title: "채팅 기능 활용",
    desc: "실시간 채팅으로 독서 토론을 더욱 생동감 있게 진행할 수 있어요.",
    icon: "/icons_chat.svg",
  },
];

export default function LandingChatSection() {
  return (
    <section className="bg-Gray-7 py-20 t:py-28">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-16 px-6 d:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="body_2_1 text-Subbrown-3">독서 토론</span>
          <h2 className="subhead_1 text-white t:headline_3">
            독서 토론의 의문부터 끝까지!
          </h2>
          <p className="body_1_2 text-white/60">
            책 토론에 필요한 모든 것, 한 곳에서 시작하세요.
          </p>
        </div>

        <div className="grid gap-6 t:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-4 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-2/30">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={20}
                  height={20}
                  className="brightness-0 invert"
                />
              </div>
              <h3 className="subhead_3_1 text-white">{feature.title}</h3>
              <p className="body_1_2 text-white/60">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6 text-center">
          <p className="subhead_2 text-white t:subhead_1">
            독서 토론의 의문부터 끝까지, 책모.
          </p>
          <Link
            href="/signup"
            className="subhead_3_2 rounded-full bg-primary-1 px-10 py-4 text-white transition-opacity hover:opacity-80"
          >
            지금 시작하기
          </Link>
        </div>
      </div>
    </section>
  );
}
