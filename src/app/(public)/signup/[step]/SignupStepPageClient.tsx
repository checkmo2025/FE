"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import TermsAgreement from "@/components/base-ui/Join/steps/TermsAgreement/TermsAgreement";
import EmailVerification from "@/components/base-ui/Join/steps/EmailVerification/EmailVerification";
import PasswordEntry from "@/components/base-ui/Join/steps/PasswordEntry/PasswordEntry";
import ProfileSetup from "@/components/base-ui/Join/steps/ProfileSetup/ProfileSetup";
import ProfileImage from "@/components/base-ui/Join/steps/ProfileImage/ProfileImage";
import SignupComplete from "@/components/base-ui/Join/steps/SignupComplete/SignupComplete";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useSignup } from "@/contexts/SignupContext";
import { useAuthStore } from "@/store/useAuthStore";
import {
    isProfileIncomplete,
    PROFILE_COMPLETION_ROUTE,
} from "@/utils/profileCompletion";

export default function SignupStepPageClient() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const step = params.step as string;
    const { isSocial, setIsSocial, setEmail, email } = useSignup();
    const { user, isLoggedIn } = useAuthStore();
    const [hasDismissedProfileNotice, setHasDismissedProfileNotice] = useState(false);
    const isProfileNoticeOpen =
        step === "profile" &&
        searchParams.get("profileRequired") === "true" &&
        !hasDismissedProfileNotice;

    useEffect(() => {
        const isSocialParam = searchParams.get("isSocial");
        const urlIsSocial = isSocialParam === "true";
        const urlIsSocialFalse = isSocialParam === "false";

        if (urlIsSocialFalse) {
            router.replace("/");
            return;
        }

        const needsProfileCompletion = isLoggedIn && isProfileIncomplete(user);
        const shouldBeSocial = urlIsSocial || needsProfileCompletion;

        if (shouldBeSocial) {
            if (!isSocial) {
                setIsSocial(true);
            }

            const newEmail = user?.email ?? searchParams.get("email");
            if (newEmail && newEmail !== email) {
                setEmail(newEmail);
            }

            if (step === "email" || step === "password") {
                router.replace(PROFILE_COMPLETION_ROUTE);
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
        return null;
    }

    return (
        <>
            {currentStep}
            <ConfirmModal
                isOpen={isProfileNoticeOpen}
                message="프로필을 완성해주세요"
                onConfirm={() => setHasDismissedProfileNotice(true)}
                onCancel={() => setHasDismissedProfileNotice(true)}
            />
        </>
    );
}
