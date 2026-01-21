import React from "react";
import TermsAgreement from "@/components/base-ui/Join/steps/TermsAgreement";

export default function SignupPage() {
  return (
    <div
      className="relative flex items-center justify-center w-full min-h-screen py-12 bg-center bg-cover"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      {/* Modal Container */}
      <div className="relative z-10 flex flex-col w-11/12 mx-auto bg-white rounded-lg shadow-lg md:max-w-3xl">
        <TermsAgreement />
      </div>
    </div>
  );
}
