"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoginLogo from "@/components/base-ui/Login/LoginLogo";
import PrimaryButton from "@/components/common/find-account/PrimaryButton";
import InputField from "@/components/common/find-account/InputField";
import { toast } from "react-hot-toast";
import { useFindEmailMutation } from "@/hooks/mutations/useMemberMutations";
import { formatPhoneNumber } from "@/utils/phone";

export default function FindAccountPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const { mutate: findEmail, isPending } = useFindEmailMutation();

    const handleBack = () => {
        router.back();
    };

    const handleFindId = () => {
        if (!name || !phone) {
            toast.error("이름과 전화번호를 모두 입력해주세요.");
            return;
        }

        findEmail(
            { name, phoneNumber: phone.replace(/-/g, "") },
            {
                onSuccess: (data) => {
                    router.push(`/find-account/result?email=${encodeURIComponent(data.email)}`);
                }
            }
        );
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
                            disabled={isPending}
                        />
                        <InputField
                            type="tel"
                            placeholder="전화번호"
                            value={phone}
                            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                            maxLength={13}
                            disabled={isPending}
                        />
                    </div>

                    {/* 하단 버튼 그룹 */}
                    <div className="flex items-center gap-[10px] justify-center w-full">
                        <PrimaryButton onClick={handleBack} disabled={isPending}>
                            뒤로가기
                        </PrimaryButton>
                        <PrimaryButton onClick={handleFindId} disabled={isPending}>
                            {isPending ? "검색 중..." : "아이디 찾기"}
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
