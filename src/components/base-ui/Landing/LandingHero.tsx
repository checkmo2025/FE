"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function LandingHero() {
  const router = useRouter();
  const { openLoginModal } = useAuthStore();

  const handleJoin = () => {
    openLoginModal();
    router.push("/home");
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Image
        src="/landing/landing-first-background.svg"
        alt="책모 배경"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <div className="relative h-16 w-28 t:h-20 t:w-36">
          <Image
            src="/logo.svg"
            alt="책모"
            fill
            className="object-contain brightness-0 invert"
            priority
          />
        </div>

        <h1 className="headline_3 t:headline_2 text-white">
          독서의 처음부터 토론의 끝까지!
        </h1>

        <p className="body_1_2 max-w-[480px] text-white/80 t:text-[16px]">
          책모는 독서를 사랑하는 모든 사람을 위한 모임 플랫폼입니다.
          <br className="hidden t:block" />
          모임에 참여하고, 책 이야기를 나누고, 깊이 있는 독서 토론을 경험해 보세요.
        </p>

        <button
          onClick={handleJoin}
          className="subhead_3_2 mt-2 rounded-full bg-primary-1 px-8 py-3.5 text-white transition-opacity hover:opacity-80"
        >
          지금 가입하기
        </button>
      </div>
    </section>
  );
}
