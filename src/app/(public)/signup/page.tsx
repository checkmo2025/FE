"use client";

import React, { useState } from "react";
import TermsAgreement from "@/components/base-ui/Join/steps/TermsAgreement/TermsAgreement";
import EmailVerification from "@/components/base-ui/Join/steps/EmailVerification/EmailVerification";
import PasswordEntry from "@/components/base-ui/Join/steps/PasswordEntry/PasswordEntry";
import ProfileSetup from "@/components/base-ui/Join/steps/ProfileSetup/ProfileSetup";
import ProfileImage from "@/components/base-ui/Join/steps/ProfileImage/ProfileImage";
import SignupComplete from "@/components/base-ui/Join/steps/SignupComplete/SignupComplete";

export default function SignupPage() {
  const [step, setStep] = useState<
    "terms" | "email" | "password" | "profile" | "profile-image" | "complete"
  >("terms");
  const steps = {
    terms: (
      <TermsAgreement
        onNext={() => {
          setStep("email");
        }}
      />
    ),
    email: <EmailVerification onNext={() => setStep("password")} />,
    password: <PasswordEntry onNext={() => setStep("profile")} />,
    profile: <ProfileSetup onNext={() => setStep("profile-image")} />,
    "profile-image": <ProfileImage onNext={() => setStep("complete")} />,
    complete: <SignupComplete />,
  };

  return (
    <>
      {steps[step]}
    </>
  );
}
