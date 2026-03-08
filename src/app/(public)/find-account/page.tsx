"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoginLogo from "@/components/base-ui/Login/LoginLogo";
import { useAuthStore } from "@/store/useAuthStore";

export default function FindAccountPage() {
    const router = useRouter();
    const openLoginModal = useAuthStore((state) => state.openLoginModal);

    const [step, setStep] = useState<"input" | "result">("input");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const handleBack = () => {
        router.back();
    };

    const handleFindId = () => {
        // API 연동 전이므로 퍼블리싱(UI) 중심 구현, 
        // 추후 이름과 전화번호 정보로 아이디 찾기 API 호출
        console.log("아이디 찾기 요청:", { name, phone });
        setStep("result");
    };

    const handleLogin = () => {
        router.push("/");
        openLoginModal();
    };

    const handleReissuePassword = () => {
        console.log("비밀번호 재발급 클릭");
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/background.png')" }}
        >
            <div
                className={`flex w-[766px] px-[120px] py-[99px] items-center justify-center flex-col rounded-lg bg-white shadow-xl ${step === "input" ? "gap-[30px]" : "gap-[363px]"
                    }`}
            >
                {step === "input" ? (
                    <>
                        {/* 상단 텍스트 및 로고 영역 */}
                        <div className="flex flex-col items-center gap-[80px] w-full">
                            <div className="flex flex-col items-center gap-[24px]">
                                <LoginLogo />
                                <h1 className="text-primary-2 text-center subhead_1">
                                    아이디<br />
                                    <span className="text-Gray-[434343] subhead_4_1">(이메일 찾기)</span>
                                </h1>
                            </div>
                            <p className="text-Gray-6 text-center subhead_1">
                                이름과 전화번호를 입력해주세요
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-[140px] w-full">
                            {/* 폼 영역 */}
                            <div className="flex flex-col items-start gap-[24px] w-full">
                                <div className="flex h-[44px] px-[16px] py-[12px] items-center gap-[10px] self-stretch rounded-lg border border-Subbrown-4 bg-White">
                                    <input
                                        type="text"
                                        placeholder="이름"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="flex flex-col justify-center flex-1 self-stretch text-Black body_1_3 outline-none placeholder:text-Gray-3"
                                    />
                                </div>

                                <div className="flex h-[44px] px-[16px] py-[12px] items-center gap-[10px] self-stretch rounded-lg border border-Subbrown-4 bg-White">
                                    <input
                                        type="text"
                                        placeholder="전화번호"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="flex flex-col justify-center flex-1 self-stretch text-Black body_1_3 outline-none placeholder:text-Gray-3"
                                    />
                                </div>
                            </div>

                            {/* 하단 버튼 그룹 */}
                            <div className="flex items-center gap-[10px]">
                                <button
                                    onClick={handleBack}
                                    className="flex w-[258px] h-[48px] px-[16px] py-[12px] justify-center items-center rounded-lg bg-primary-1 text-White body_1_1 hover:bg-primary-3 transition-colors"
                                >
                                    뒤로가기
                                </button>
                                <button
                                    onClick={handleFindId}
                                    className="flex w-[258px] h-[48px] px-[16px] py-[12px] justify-center items-center rounded-lg bg-primary-1 text-White body_1_1 hover:bg-primary-3 transition-colors"
                                >
                                    아이디 찾기
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* 결과 뷰 - 상단/중단 영역 */}
                        <div className="flex flex-col items-start gap-[120px] w-[526px] shrink-0">
                            <div className="flex flex-col items-center gap-[36px] self-stretch h-[114px]">
                                <div className="flex flex-col items-center gap-[24px]">
                                    <LoginLogo />
                                    <h1 className="text-primary-2 text-center subhead_1">
                                        아이디<br />
                                        <span className="text-Gray-[434343] subhead_4_1">(이메일 찾기)</span>
                                    </h1>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-[30px] self-stretch">
                                <p className="text-Gray-6 text-center subhead_1 self-stretch">
                                    해당 정보의 이메일은 다음과 같습니다.
                                </p>

                                <div className="flex h-[44px] px-[16px] py-[12px] items-center gap-[10px] self-stretch rounded-lg border border-Subbrown-4 bg-White">
                                    <div className="flex flex-col justify-center flex-1 self-stretch text-Black body_1_3">
                                        20자 이내
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 결과 뷰 - 하단 버튼 그룹 */}
                        <div className="flex items-center gap-[10px] justify-center">
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
                    </>
                )}
            </div>
        </div>
    );
}
