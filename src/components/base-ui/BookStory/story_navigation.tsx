"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type StoryNavigationProps = {
  currentId: number;
  prevId: number | null;
  nextId: number | null;
  children: React.ReactNode;
};

export default function StoryNavigation({
  currentId,
  prevId,
  nextId,
  children,
}: StoryNavigationProps) {
  const router = useRouter();

  const handlePrev = () => {
    if (prevId) {
      router.push(`/stories/${prevId}`);
    }
  };

  const handleNext = () => {
    if (nextId) {
      router.push(`/stories/${nextId}`);
    }
  };

  return (
    <div className="relative flex items-center mt-6 w-full t:justify-between">
      {/* 이전 버튼 - 태블릿/데스크탑 */}
      <button
        type="button"
        onClick={handlePrev}
        disabled={!prevId}
        className={`hidden t:block shrink-0 cursor-pointer ${
          !prevId ? "opacity-30 cursor-not-allowed" : "hover:opacity-70"
        }`}
      >
        <Image src="/ArrowLeft.svg" alt="이전 글" width={20} height={39} />
      </button>

      {/* 모바일: 컨텐츠 + 오버레이 화살표 */}
      <div className="relative t:hidden w-full">
        {children}

        {/* 이전 버튼 - 이미지 위 오버레이 */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={!prevId}
          className={`absolute left-0 top-[250px] -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/70 shadow-sm cursor-pointer ${
            !prevId ? "opacity-30 cursor-not-allowed" : "hover:bg-white"
          }`}
        >
          <Image
            src="/ArrowThickLeft.svg"
            alt="이전 글"
            width={12}
            height={24}
          />
        </button>

        {/* 다음 버튼 - 이미지 위 오버레이 */}
        <button
          type="button"
          onClick={handleNext}
          disabled={!nextId}
          className={`absolute right-0 top-[250px] -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/70 shadow-sm cursor-pointer ${
            !nextId ? "opacity-30 cursor-not-allowed" : "hover:bg-white"
          }`}
        >
          <Image
            src="/ArrowThickRight.svg"
            alt="다음 글"
            width={12}
            height={24}
          />
        </button>
      </div>

      {/* 태블릿/데스크탑: 컨텐츠 */}
      <div className="hidden t:block flex-1">{children}</div>

      {/* 다음 버튼 - 태블릿/데스크탑 */}
      <button
        type="button"
        onClick={handleNext}
        disabled={!nextId}
        className={`hidden t:block shrink-0 cursor-pointer ${
          !nextId ? "opacity-30 cursor-not-allowed" : "hover:opacity-70"
        }`}
      >
        <Image src="/ArrowRight.svg" alt="다음 글" width={20} height={39} />
      </button>
    </div>
  );
}
