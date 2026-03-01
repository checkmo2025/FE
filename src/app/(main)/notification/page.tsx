"use client";

import Image from "next/image";
import Link from "next/link";

export default function NotificationPlaceholderPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <div className="relative w-24 h-24 mb-6 opacity-20">
                <Image
                    src="/notification.svg"
                    alt="Notification Icon"
                    fill
                    className="object-contain grayscale"
                />
            </div>
            <h1 className="text-2xl font-bold text-Gray-7 mb-2 t:subhead_1">
                알림 기능은 준비 중입니다!
            </h1>
            <p className="text-Gray-5 body_1 mb-8">
                더 나은 서비스를 위해 열심히 준비하고 있습니다.<br />
                조금만 기다려 주세요.
            </p>
            <Link
                href="/"
                className="px-8 py-3 bg-primary-2 text-White rounded-lg body_1_2 hover:brightness-95 transition-all shadow-sm"
            >
                홈으로 돌아가기
            </Link>
        </div>
    );
}
