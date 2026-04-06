"use client";

import React, { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import TermsAgreement from "@/components/base-ui/Join/steps/TermsAgreement/TermsAgreement";
import EmailVerification from "@/components/base-ui/Join/steps/EmailVerification/EmailVerification";
import PasswordEntry from "@/components/base-ui/Join/steps/PasswordEntry/PasswordEntry";
import ProfileSetup from "@/components/base-ui/Join/steps/ProfileSetup/ProfileSetup";
import ProfileImage from "@/components/base-ui/Join/steps/ProfileImage/ProfileImage";
import SignupComplete from "@/components/base-ui/Join/steps/SignupComplete/SignupComplete";
import { useSignup } from "@/contexts/SignupContext";
import { useAuthStore } from "@/store/useAuthStore";

export default function SignupStepPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const step = params.step as string;
    const { isSocial, setIsSocial, setEmail, email } = useSignup();
    const { user, isLoggedIn } = useAuthStore();

    // 소셜 로그인 여부 감지 및 리다이렉트 가드
    useEffect(() => {
        const isSocialParam = searchParams.get("isSocial");
        const urlIsSocial = isSocialParam === "true";
        const urlIsSocialFalse = isSocialParam === "false";

        // 1. 기존 유저 (isSocial=false)인 경우 메인으로 리다이렉트
        if (urlIsSocialFalse) {
            router.replace("/");
            return;
        }

        // 이미 로그인되어 있는데 프로필 정보가 없는 경우 (소셜 로그인 직후 리다이렉트된 상태)
        const storeIsSocial = isLoggedIn && user && !user.nickname;
        const shouldBeSocial = urlIsSocial || storeIsSocial;

        if (shouldBeSocial) {
            if (!isSocial) {
                setIsSocial(true);
            }

            const newEmail = user?.email ?? searchParams.get("email");
            if (newEmail && newEmail !== email) {
                setEmail(newEmail);
            }

            // 2. 소셜 가입 신규 유저인데 이메일/비밀번호 단계에 진입한 경우 프로필로 강제 이동
            if (step === "email" || step === "password") {
                router.replace(`/signup/profile?isSocial=true`);
            }
        }
    }, [searchParams, user, isLoggedIn, isSocial, email, setIsSocial, setEmail, step, router]);

    const navigateTo = (nextStep: string) => {
        const query = isSocial ? "?isSocial=true" : "";
        router.push(`/signup/${nextStep}${query}`);
    };

    const steps: Record<string, React.ReactNode> = {
        terms: (
            <TermsAgreement
                onNext={() => navigateTo(isSocial ? "profile" : "email")}
            />
        ),
        email: <EmailVerification onNext={() => navigateTo("password")} />,
        password: <PasswordEntry onNext={() => navigateTo("profile")} />,
        profile: <ProfileSetup onNext={() => navigateTo("profile-image")} />,
        "profile-image": <ProfileImage onNext={() => navigateTo("complete")} />,
        complete: <SignupComplete />,
    };

    const currentStep = steps[step];

    if (!currentStep) {
        // Falls back to terms if step is invalid
        return null;
    }

    return <>{currentStep}</>;
}
