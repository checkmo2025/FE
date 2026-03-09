"use client";

import Image from "next/image";
import { useNotificationPreviewQuery } from "@/hooks/queries/useNotificationQueries";
import { useRouter } from "next/navigation";

export default function NotificationDropdown() {
    const { data: notifications, isLoading } = useNotificationPreviewQuery(5);
    const router = useRouter();

    const handleNotificationClick = () => {
        router.push("/profile/mypage");
    };

    return (
        <div
            className="absolute top-[44px] right-0 z-50 flex w-[364px] flex-col items-start rounded-[8px] bg-White/80 backdrop-blur-sm shadow-[0_4px_8px_0_rgba(0,0,0,0.08)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
        >
            {isLoading ? (
                <div className="flex w-full items-center justify-center py-10">
                    <span className="text-Gray-4 body_2">알림을 불러오는 중...</span>
                </div>
            ) : notifications && notifications.length > 0 ? (
                notifications.map((notif) => (
                    <div
                        key={notif.notificationId}
                        onClick={handleNotificationClick}
                        className="flex w-full items-center justify-between border-b border-Subbrown-4 px-[16px] py-[15px] transition-colors hover:bg-black/5 cursor-pointer"
                    >
                        <div className="flex items-center gap-[12px] pr-[10px]">
                            <div className="flex justify-center items-center shrink-0 w-6 h-6">
                                {!notif.read && (
                                    <Image
                                        src="/icon_alert.svg"
                                        alt="Alert"
                                        width={24}
                                        height={24}
                                    />
                                )}
                            </div>
                            <span
                                className={`text-[14px] leading-[145%] tracking-[-0.014px] break-keep ${notif.read ? "text-Gray-3 font-medium" : "text-Gray-7 font-medium"
                                    }`}
                            >
                                {notif.displayName}
                            </span>
                        </div>
                        <span
                            className={`text-[12px] leading-[145%] tracking-[-0.012px] shrink-0 ${notif.read ? "text-Gray-3 font-normal" : "text-Gray-5 font-normal"
                                }`}
                        >
                            {/* 날짜 형식 변환이 필요할 수 있으나 생략하거나 간단히 처리 */}
                            {new Date(notif.createdAt).toLocaleDateString() ===
                                new Date().toLocaleDateString()
                                ? "오늘"
                                : "과거"}
                        </span>
                    </div>
                ))
            ) : (
                <div className="flex w-full items-center justify-center py-10">
                    <span className="text-Gray-4 body_2">새로운 알림이 없습니다.</span>
                </div>
            )}

            {/* 전체보기 버튼 */}
            <div
                onClick={() => router.push("/profile/mypage")}
                className="flex w-full items-center justify-center py-[16px] cursor-pointer hover:bg-black/5 transition-colors"
            >
                <span className="text-Gray-7 font-normal text-[18px] leading-[135%] tracking-[-0.018px]">
                    전체보기
                </span>
            </div>
        </div>
    );
}
