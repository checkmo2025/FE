"use client";

import Image from "next/image";

export default function NotificationDropdown() {
    return (
        <div
            className="absolute top-[44px] right-0 z-50 flex w-[364px] flex-col items-start rounded-[8px] bg-White/80 backdrop-blur-sm shadow-[0_4px_8px_0_rgba(0,0,0,0.08)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
        >
            {/* 알림 항목 1: 활성/최근 알림 */}
            <div className="flex w-[364px] items-center justify-between border-b border-Subbrown-4 px-[16px] py-[15px] transition-colors hover:bg-black/5 cursor-pointer">
                <div className="flex items-center gap-[12px] pr-[10px]">
                    <div className="flex justify-center items-center shrink-0">
                        <Image src="/icon_alert.svg" alt="Alert" width={24} height={24} />
                    </div>
                    <span className="text-Gray-7 font-medium text-[14px] leading-[145%] tracking-[-0.014px] break-keep">
                        경표짜응님이 좋아요를 눌렀습니다.
                    </span>
                </div>
                <span className="text-Gray-5 font-normal text-[12px] leading-[145%] tracking-[-0.012px] shrink-0">
                    지금
                </span>
            </div>

            {/* 알림 항목 2~5: 읽은/일반 알림 스타일 반복 (총 5개) */}
            {[...Array(4)].map((_, idx) => (
                <div
                    key={idx}
                    className="flex w-[364px] items-center justify-between border-b border-Subbrown-4 px-[16px] py-[15px] transition-colors hover:bg-black/5 cursor-pointer"
                >
                    <div className="flex items-center gap-[12px] pr-[10px]">
                        {/* 24x24 빈 영역 아이콘 공간 확보 */}
                        <div className="flex h-[24px] w-[24px] shrink-0 items-center justify-center p-[6px]"></div>
                        <span className="text-Gray-3 font-medium text-[14px] leading-[145%] tracking-[-0.014px]">
                            경표짜응님이 댓글을 남겼습니다: 정말 재..
                        </span>
                    </div>
                    <span className="text-Gray-3 font-normal text-[12px] leading-[145%] tracking-[-0.012px] shrink-0">
                        2분 전
                    </span>
                </div>
            ))}

            {/* 전체보기 버튼 */}
            <div className="flex w-full items-center justify-center py-[16px] cursor-pointer hover:bg-black/5 transition-colors">
                <span className="text-Gray-7 font-normal text-[18px] leading-[135%] tracking-[-0.018px]">
                    전체보기
                </span>
            </div>
        </div>
    );
}
