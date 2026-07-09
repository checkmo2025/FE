"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useMotionValueEvent, animate } from "framer-motion";

export interface CarouselItem {
  id: string | number;
  imageUrl: string;
  title: string;
  description: string;
  link: string; // The URL to navigate to
}

interface SwipeCarouselProps {
  items: CarouselItem[];
  autoPlayInterval?: number;
  heightClass?: string; // e.g. "h-[297px] t:h-[424px]"
  maxWidthClass?: string; // e.g. "w-full max-w-[1040px]"
  showTitleLarge?: boolean; // Controls whether to show large text (for NewsListBanner) or normal (for NewsBannerSlider)
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

// 음수 인덱스 처리 및 배열 범위를 안전하게 순환하기 위한 함수
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export default function SwipeCarousel({
  items,
  autoPlayInterval = 5000,
  heightClass = "h-[297px] t:h-[424px]",
  maxWidthClass = "w-full",
  showTitleLarge = false,
}: SwipeCarouselProps) {
  const router = useRouter();
  
  // 렌더링용 인덱스 (DOM 요소 재배치용, 애니메이션 완료 시점에 업데이트)
  const [renderIndex, setRenderIndex] = useState(0);
  const renderIndexRef = useRef(renderIndex);
  
  // React 상태와 Ref를 즉각적으로 동기화하는 헬퍼 함수
  const updateRenderIndex = (newIndex: number) => {
    renderIndexRef.current = newIndex;
    setRenderIndex(newIndex);
  };
  
  // 시각용 인덱스 (하단 점선 인디케이터용, 드래그 중 실시간 업데이트)
  const [indicatorIndex, setIndicatorIndex] = useState(0);

  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const slideCount = items.length;
  const safeIndex = slideCount > 0 ? wrap(0, slideCount, renderIndex) : 0;

  // 가상화: 이전, 현재, 다음 카드만 렌더링
  const prevIndex = slideCount > 0 ? wrap(0, slideCount, renderIndex - 1) : 0;
  const nextIndex = slideCount > 0 ? wrap(0, slideCount, renderIndex + 1) : 0;

  // x 좌표를 실시간 추적하여 절반 이상 넘어갔을 때 인디케이터를 선제적으로 교체
  useMotionValueEvent(x, "change", (latestX) => {
    if (!containerRef.current || slideCount <= 1) return;
    const containerWidth = containerRef.current.offsetWidth;
    
    let offsetIndex = 0;
    if (latestX <= -containerWidth / 2) {
      offsetIndex = 1;
    } else if (latestX >= containerWidth / 2) {
      offsetIndex = -1;
    }

    const newIndicatorIndex = wrap(0, slideCount, renderIndexRef.current + offsetIndex);
    if (newIndicatorIndex !== indicatorIndex) {
      setIndicatorIndex(newIndicatorIndex);
    }
  });

  const navigateToSlide = (direction: number) => {
    if (slideCount <= 1) return;
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const targetX = direction > 0 ? -containerWidth : containerWidth;

    animate(x, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      onComplete: () => {
        // 애니메이션이 끝나면 렌더링 인덱스를 동기화하고 x를 즉시 초기화
        const newRenderIndex = renderIndexRef.current + direction;
        updateRenderIndex(newRenderIndex); // Ref를 즉시 변경하여 꼬임 방지
        setIndicatorIndex(wrap(0, slideCount, newRenderIndex));
        x.set(0); // 이 순간 change 이벤트가 트리거되어도 최신 Ref를 바라봄
      },
    });
  };

  const jumpTo = (targetIdx: number) => {
    if (slideCount <= 1) return;
    const diff = targetIdx - indicatorIndex;
    if (diff === 0) return;

    // 인디케이터 클릭 시엔 즉각적으로 두 인덱스를 모두 동기화
    const newRenderIndex = renderIndexRef.current + diff;
    updateRenderIndex(newRenderIndex);
    setIndicatorIndex(targetIdx);
    x.set(0);
  };

  useEffect(() => {
    if (slideCount <= 1 || autoPlayInterval <= 0) return;
    
    if (isDragging) return;

    const timer = setInterval(() => {
      navigateToSlide(1);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [slideCount, renderIndex, autoPlayInterval, isDragging]);

  if (slideCount === 0) {
    return (
      <div className={`relative ${heightClass} ${maxWidthClass} mx-auto overflow-hidden rounded-[10px] bg-gray-50 flex flex-col items-center justify-center gap-2 border border-Gray-1`}>
        <div className="text-gray-400 text-lg font-medium text-center px-4">표시할 내용이 없습니다.</div>
      </div>
    );
  }

  const renderCard = (item: CarouselItem, position: string) => {
    return (
      <div
        className="absolute top-0 bottom-0 w-full flex-shrink-0"
        style={{ left: position }}
      >
        <div 
          className="w-full h-full relative cursor-pointer"
          onClick={() => {
            if (isDragging) return; // 드래그 중 클릭 방지
            router.push(item.link);
          }}
        >
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover object-left-top transition-transform duration-700 hover:scale-105 pointer-events-none"
            priority={position === "0%"}
            draggable={false}
          />
          <div className="absolute inset-y-0 right-0 w-full md:w-1/2 p-6 t:p-10 flex flex-col justify-center items-end bg-gradient-to-l from-black/90 via-black/50 to-transparent text-right pointer-events-none">
            <div className="flex flex-col gap-2 t:gap-3 text-white">
              <h3 className={`${showTitleLarge ? "text-xl t:text-3xl" : "text-2xl t:text-4xl"} font-bold leading-tight drop-shadow-md`}>
                {item.title}
              </h3>
              <p className={`${showTitleLarge ? "text-xs t:text-base line-clamp-3 t:line-clamp-4 max-w-[240px]" : "text-sm t:text-lg line-clamp-4 max-w-[280px]"} t:max-w-[400px] whitespace-pre-line drop-shadow-sm font-light`}>
                {item.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className={`relative ${heightClass} ${maxWidthClass} mx-auto overflow-hidden rounded-[10px] shadow-sm`}
    >
      {/* 
        기차 트랙 (Continuous Track)
        overflow-hidden 부모 안에서 드래그 가능하며, 모바일 세로 스크롤 방지를 위해 touchAction pan-y 적용
      */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ x, touchAction: "pan-y" }}
        drag={slideCount > 1 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }} // 놓았을 때 탄성으로 돌아가게 설정
        dragElastic={1} // 1: 1대1로 따라옴
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(e, { offset, velocity }) => {
          // 약간의 딜레이를 주어 드래그 직후 발생하는 onClick 이벤트 무시
          setTimeout(() => setIsDragging(false), 50); 
          const swipe = swipePower(offset.x, velocity.x);
          const containerWidth = containerRef.current?.offsetWidth || 0;
          
          // 강하게 드래그했거나 화면의 절반 이상을 드래그했으면 이동
          if (swipe < -swipeConfidenceThreshold || offset.x < -containerWidth / 2) {
            navigateToSlide(1); // 다음 슬라이드
          } else if (swipe > swipeConfidenceThreshold || offset.x > containerWidth / 2) {
            navigateToSlide(-1); // 이전 슬라이드
          } else {
            // 제자리 스냅
            animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
          }
        }}
      >
        {/* 가상화 렌더링: 이전(-100%), 현재(0%), 다음(100%) */}
        {slideCount > 1 && renderCard(items[prevIndex], "-100%")}
        {renderCard(items[safeIndex], "0%")}
        {slideCount > 1 && renderCard(items[nextIndex], "100%")}
      </motion.div>

      {/* 인디케이터 */}
      {slideCount > 1 && (
        <div className="absolute top-[20px] left-[20px] t:top-[27px] t:left-[33px] flex gap-2 z-20">
          {items.map((_, i) => {
            const active = i === indicatorIndex;
            return (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  jumpTo(i);
                }}
                aria-label={`배너 ${i + 1}`}
                className={`transition-all duration-300 ${
                  active
                    ? "w-6 h-2 rounded-[100px] bg-primary-1"
                    : "w-2 h-2 rounded-full bg-white/50 hover:bg-white"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
