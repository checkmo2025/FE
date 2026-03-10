"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";

interface Club {
    clubId: number;
    clubName: string;
}

interface CategorySliderProps {
    selectedCategory: string;
    onCategoryChange: (categoryId: string) => void;
    myClubsData?: {
        clubList: Club[];
    };
}

const CategorySlider = ({
    selectedCategory,
    onCategoryChange,
    myClubsData,
}: CategorySliderProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5); // 5px margin of error
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, [myClubsData]);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const getCategoryClassName = (categoryId: string) => {
        return `text-center body_1 t:subhead_2 leading-7 cursor-pointer hover:text-zinc-600 shrink-0 transition-colors ${selectedCategory === categoryId ? "text-Gray-7 font-semibold" : "text-Gray-3"
            }`;
    };

    return (
        <div className="relative w-full group">
            {/* Left Gradient & Arrow */}
            {showLeftArrow && (
                <>
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#F9F7F6] to-transparent z-20 pointer-events-none" />
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-8 h-8 flex items-center justify-center bg-white/80 rounded-full shadow-sm border border-Gray-1 hover:bg-white transition-opacity"
                    >
                        <Image
                            src="/triangle.svg"
                            alt="left"
                            width={12}
                            height={12}
                            className="rotate-180"
                        />
                    </button>
                </>
            )}

            {/* Right Gradient & Arrow */}
            {showRightArrow && (
                <>
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#F9F7F6] to-transparent z-20 pointer-events-none" />
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-8 h-8 flex items-center justify-center bg-white/80 rounded-full shadow-sm border border-Gray-1 hover:bg-white transition-opacity"
                    >
                        <Image
                            src="/triangle.svg"
                            alt="right"
                            width={12}
                            height={12}
                        />
                    </button>
                </>
            )}

            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="t:mt-3 h-[44px] d:h-[54px] flex gap-8 t:gap-14 items-center border-b border-zinc-300 overflow-x-auto scrollbar-hide scroll-smooth"
            >
                <div
                    onClick={() => onCategoryChange("all")}
                    className={getCategoryClassName("all")}
                >
                    전체
                </div>
                <div
                    onClick={() => onCategoryChange("following")}
                    className={getCategoryClassName("following")}
                >
                    구독중
                </div>
                {myClubsData?.clubList.map((club) => (
                    <div
                        key={club.clubId}
                        onClick={() => onCategoryChange(club.clubId.toString())}
                        className={getCategoryClassName(club.clubId.toString())}
                    >
                        {club.clubName}
                    </div>
                ))}
                {/* Spacer to allow scrolling past the last item if needed */}
                <div className="shrink-0 w-4 t:hidden" />
            </div>
        </div>
    );
};

export default CategorySlider;
