"use client";

import Image from "next/image";

export default function AdminLoginPage() {
  return (
    <main
      className="
        min-h-screen
        flex items-center justify-center px-4
        bg-[#826656]
      "
    >
      <section
        className="
          w-full max-w-[456px] h-[276px]
          rounded-[8px]
          bg-white
          flex flex-col items-center justify-center
          text-center
        "
      >
        <Image
          src="/Vector.svg"
          alt="CheckMo Logo"
          width={76}
          height={46}
          className="w-[76.607px] h-[46.815px] shrink-0"
        />

        <div className="mt-[80px] text-black subhead_1">
          관리자 기능은 로그인이 필요합니다!
        </div>
      </section>
    </main>
  );
}