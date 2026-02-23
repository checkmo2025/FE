"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import TermsAgreement from "@/components/base-ui/Join/steps/TermsAgreement/TermsAgreement";
import EmailVerification from "@/components/base-ui/Join/steps/EmailVerification/EmailVerification";
import PasswordEntry from "@/components/base-ui/Join/steps/PasswordEntry/PasswordEntry";
import ProfileSetup from "@/components/base-ui/Join/steps/ProfileSetup/ProfileSetup";
import ProfileImage from "@/components/base-ui/Join/steps/ProfileImage/ProfileImage";
import SignupComplete from "@/components/base-ui/Join/steps/SignupComplete/SignupComplete";

export default function SignupStepPage() {
    const params = useParams();
    const router = useRouter();
    const step = params.step as string;

    const navigateTo = (nextStep: string) => {
        router.push(`/signup/${nextStep}`);
    };

    const steps: Record<string, React.ReactNode> = {
        terms: <TermsAgreement onNext={() => navigateTo("email")} />,
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
