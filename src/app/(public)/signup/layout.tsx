import React from "react";
import { SignupProvider } from "@/contexts/SignupContext";

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SignupProvider>
      <div
        className="flex min-h-screen w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat py-12"
        style={{ backgroundImage: "url('/background.png')" }}
      >
        {children}
      </div>
    </SignupProvider>
  );
}