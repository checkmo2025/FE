"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/members/me/login-status`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) return;

        const data = await res.json();
        if (data.isSuccess && data.result?.admin) {
          router.replace("/admin/users");
        }
      } catch {
        // 미로그인 상태 — 현재 페이지 유지
      }
    };

    checkAdmin();
  }, [router]);

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
          w-full max-w-[456px]
          rounded-[8px]
          bg-white
          flex flex-col items-center justify-center
          text-center
          py-[48px] gap-[32px]
        "
      >
        <Image
          src="/Vector.svg"
          alt="CheckMo Logo"
          width={76}
          height={46}
          className="w-[76.607px] h-[46.815px] shrink-0"
        />

        <p className="text-black subhead_1">
          관리자 기능은 로그인이 필요합니다!
        </p>

        <Link
          href="/"
          className="
            px-[32px] py-[12px]
            rounded-[8px]
            bg-[#826656] text-white
            subhead_2
            hover:opacity-80
            transition-opacity
            cursor-pointer
          "
        >
          홈화면 가기
        </Link>
      </section>
    </main>
  );
}
