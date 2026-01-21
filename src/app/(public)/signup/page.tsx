"use client";

import React, { useState } from "react";
import TermsAgreement from "@/components/base-ui/Join/steps/TermsAgreement/TermsAgreement";
import EmailVerification from "@/components/base-ui/Join/steps/EmailVerification/EmailVerification";
import PasswordEntry from "@/components/base-ui/Join/steps/PasswordEntry/PasswordEntry";
import ProfileSetup from "@/components/base-ui/Join/steps/ProfileSetup/ProfileSetup";

export default function SignupPage() {
  const [step, setStep] = useState<"terms" | "email" | "password" | "profile">(
    "terms"
  );

  return (
    <div
      className="relative flex items-center justify-center w-full min-h-screen py-12 bg-center bg-cover"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      {/* Modal Container */}
      <div className="relative z-10 flex flex-col w-11/12 mx-auto bg-white rounded-lg shadow-lg md:max-w-3xl">
        {step === "terms" && (
          <TermsAgreement
            onNext={() => {
              console.log("Page: Moving to email step");
              setStep("email");
            }}
          />
        )}
        {step === "email" && (
          <EmailVerification onNext={() => setStep("password")} />
        )}
        {step === "password" && (
          <PasswordEntry onNext={() => setStep("profile")} />
        )}
        {step === "profile" && <ProfileSetup />}
      </div>
    </div>
  );
}
