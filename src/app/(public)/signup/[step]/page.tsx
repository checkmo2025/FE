import type { Metadata } from "next";
import { Suspense } from "react";
import SignupStepPageClient from "./SignupStepPageClient";

export const metadata: Metadata = {
  title: "회원가입",
};

export default function SignupStepPage() {
  return (
    <Suspense fallback={null}>
      <SignupStepPageClient />
    </Suspense>
  );
}
