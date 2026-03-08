"use client";

import React from "react";
import { useRouter } from "next/navigation";
import LoginLogo from "@/components/base-ui/Login/LoginLogo";
import { useAuthStore } from "@/store/useAuthStore";

export default function FindAccountResultPage() {
    const router = useRouter();
    const openLoginModal = useAuthStore((state) => state.openLoginModal);

    const handleLogin = () => {
        router.push("/");
        openLoginModal();
    };

    const handleReissuePassword = () => {
        console.log("비밀번호 재발급 클릭");
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
                            <span className="text-Gray-[434343] subhead_4_1">(이메일 찾기)</span>
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
                                20자 이내
                            </div>
                        </div>
                    </div>

                    {/* 하단 버튼 그룹 */}
                    <div className="flex items-center gap-[10px] justify-center w-full">
                        <button
                            onClick={handleLogin}
                            className="flex w-[258px] h-[48px] px-[16px] py-[12px] justify-center items-center rounded-lg bg-primary-1 text-White body_1_1 hover:bg-primary-3 transition-colors"
                        >
                            로그인하기
                        </button>
                        <button
                            onClick={handleReissuePassword}
                            className="flex w-[258px] h-[48px] px-[16px] py-[12px] justify-center items-center rounded-lg bg-primary-1 text-White body_1_1 hover:bg-primary-3 transition-colors"
                        >
                            비밀번호 재발급
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
