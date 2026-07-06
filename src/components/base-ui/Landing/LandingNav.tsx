"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { openLoginModal } = useAuthStore();

  const handleLogin = () => {
    openLoginModal();
    router.push("/home");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-primary-1 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 t:px-6 t:py-4 d:px-8">
        <Link href="/" className="relative h-7 w-12 overflow-hidden t:h-8 t:w-14">
          <Image
            src="/logo.svg"
            alt="책모"
            fill
            className="object-contain brightness-0 invert"
            priority
          />
        </Link>
        <div className="flex items-center gap-2 t:gap-3">
          <Link
            href="/home"
            className="body_1_2 hidden rounded-full px-4 py-2 text-white/90 transition-colors hover:text-white t:inline-block"
          >
            바로가기
          </Link>
          <button
            onClick={handleLogin}
            className={`body_2_1 cursor-pointer rounded-full px-4 py-1.5 transition-all active:scale-95 t:body_1_1 t:px-5 t:py-2 ${
              scrolled
                ? "bg-white text-primary-1 hover:bg-white/90 hover:shadow-md"
                : "bg-primary-1 text-white hover:bg-primary-3 hover:shadow-md"
            }`}
          >
            로그인/회원가입
          </button>
        </div>
      </div>
    </nav>
  );
}
