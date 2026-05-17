"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 d:px-8">
        <Link href="/" className="relative h-8 w-14 overflow-hidden">
          <Image
            src="/logo.svg"
            alt="책모 로고"
            fill
            className={`object-contain transition-all duration-300 ${scrolled ? "" : "brightness-0 invert"}`}
            priority
          />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/find-account"
            className={`body_1_2 rounded-full px-4 py-2 transition-colors ${
              scrolled
                ? "text-Gray-6 hover:text-primary-1"
                : "text-white/90 hover:text-white"
            }`}
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="body_1_1 rounded-full bg-primary-1 px-5 py-2 text-white transition-opacity hover:opacity-80"
          >
            지금 가입하기
          </Link>
        </div>
      </div>
    </nav>
  );
}
