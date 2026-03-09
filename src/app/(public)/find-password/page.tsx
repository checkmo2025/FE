"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoginLogo from "@/components/base-ui/Login/LoginLogo";
import PrimaryButton from "@/components/common/find-account/PrimaryButton";
import InputField from "@/components/common/find-account/InputField";

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
                        <InputField
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* 하단 버튼 그룹 */}
                    <div className="flex items-center gap-[10px] justify-center w-full">
                        <PrimaryButton onClick={handleBack}>
                            뒤로가기
                        </PrimaryButton>
                        <PrimaryButton onClick={handleSendTempPassword}>
                            임시 비밀번호 전송
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
