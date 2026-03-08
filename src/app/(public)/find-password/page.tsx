"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoginLogo from "@/components/base-ui/Login/LoginLogo";

export default function FindPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");

    const handleBack = () => {
        router.back();
    };

    const handleSendTempPassword = () => {
        // API 연동 전이므로 퍼블리싱(UI) 중심 구현
        console.log("임시 비밀번호 전송 요청:", { email });
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
                            비밀번호 재발급
                        </h1>
                    </div>
                    <p className="text-Gray-6 text-center subhead_1">
                        이메일을 입력해주세요
                    </p>
                </div>

                <div className="flex flex-col items-center gap-[140px] w-full">
                    {/* 폼 영역 */}
                    <div className="flex flex-col items-start gap-[24px] w-full max-w-[526px]">
                        <div className="flex h-[44px] px-[16px] py-[12px] items-center gap-[10px] self-stretch rounded-lg border border-Subbrown-4 bg-White">
                            <input
                                type="text"
                                placeholder="이메일"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex flex-col justify-center flex-1 self-stretch text-Black body_1_3 outline-none placeholder:text-Gray-3"
                            />
                        </div>
                    </div>

                    {/* 하단 버튼 그룹 */}
                    <div className="flex items-center gap-[10px] justify-center w-full">
                        <button
                            onClick={handleBack}
                            className="flex w-[258px] h-[48px] px-[16px] py-[12px] justify-center items-center rounded-lg bg-primary-1 text-White body_1_1 hover:bg-primary-3 transition-colors"
                        >
                            뒤로가기
                        </button>
                        <button
                            onClick={handleSendTempPassword}
                            className="flex w-[258px] h-[48px] px-[16px] py-[12px] justify-center items-center rounded-lg bg-primary-1 text-White body_1_1 hover:bg-primary-3 transition-colors"
                        >
                            임시 비밀번호 전송
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
