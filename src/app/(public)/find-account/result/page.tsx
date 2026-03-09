"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginLogo from "@/components/base-ui/Login/LoginLogo";
import { useAuthStore } from "@/store/useAuthStore";
import PrimaryButton from "@/components/common/find-account/PrimaryButton";

function FindAccountResultContent() {
    const router = useRouter();
    const openLoginModal = useAuthStore((state) => state.openLoginModal);

    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "이메일 정보 없음";

    const handleLogin = () => {
        router.push("/");
        openLoginModal();
    };

    const handleReissuePassword = () => {
        router.push("/find-password");
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat py-12"
            style={{ backgroundImage: "url('/background.png')" }}
        >
            <div
                className="flex w-[766px] px-[120px] py-[99px] items-center justify-center flex-col gap-[30px] rounded-lg bg-white shadow-xl"
            >
                {/* 상단 텍스트 및 로고 영역 */}
                <div className="flex flex-col items-center gap-[80px] w-full">
                    <div className="flex flex-col items-center gap-[24px]">
                        <LoginLogo />
                        <h1 className="text-primary-2 text-center subhead_1">
                            아이디<br />
                            <span className="text-primary-2 subhead_4_1">(이메일 찾기)</span>
                        </h1>
                    </div>
                    <p className="text-Gray-6 text-center subhead_1 self-stretch">
                        해당 정보의 이메일은 다음과 같습니다.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-[140px] w-full">
                    {/* 결과 노출 영역 */}
                    <div className="flex flex-col items-start gap-[24px] w-full max-w-[526px]">
                        <div className="flex h-[44px] px-[16px] py-[12px] items-center gap-[10px] self-stretch rounded-lg border border-Subbrown-4 bg-White w-full">
                            <div className="flex flex-col justify-center flex-1 self-stretch text-Black body_1_3">
                                {email}
                            </div>
                        </div>
                    </div>

                    {/* 하단 버튼 그룹 */}
                    <div className="flex items-center gap-[10px] justify-center w-full">
                        <PrimaryButton onClick={handleLogin}>
                            로그인하기
                        </PrimaryButton>
                        <PrimaryButton onClick={handleReissuePassword}>
                            비밀번호 재발급
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FindAccountResultPage() {
    return (
        <Suspense fallback={<div className="min-h-screen w-full bg-[#FAFAFA]" />}>
            <FindAccountResultContent />
        </Suspense>
    );
}

