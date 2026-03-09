"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoginLogo from "@/components/base-ui/Login/LoginLogo";
import PrimaryButton from "@/components/common/find-account/PrimaryButton";
import InputField from "@/components/common/find-account/InputField";

export default function FindAccountPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const handleBack = () => {
        router.back();
    };

    const handleFindId = () => {
        // API 연동 전이므로 퍼블리싱(UI) 중심 구현,
        // 추후 이름과 전화번호 정보로 아이디 찾기 API 호출 (또는 결과에 넘기기)
        console.log("아이디 찾기 요청:", { name, phone });
        router.push("/find-account/result");
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
                            <span className="text-Gray-6 subhead_4_1">(이메일 찾기)</span>
                        </h1>
                    </div>
                    <p className="text-Gray-6 text-center subhead_1">
                        이름과 전화번호를 입력해주세요
                    </p>
                </div>

                <div className="flex flex-col items-center gap-[140px]">
                    {/* 폼 영역 */}
                    <div className="flex flex-col items-start gap-[24px] w-full max-w-[526px]">
                        <InputField
                            type="text"
                            placeholder="이름"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <InputField
                            type="tel"
                            placeholder="전화번호"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    {/* 하단 버튼 그룹 */}
                    <div className="flex items-center gap-[10px] justify-center w-full">
                        <PrimaryButton onClick={handleBack}>
                            뒤로가기
                        </PrimaryButton>
                        <PrimaryButton onClick={handleFindId}>
                            아이디 찾기
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
