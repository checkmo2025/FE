import React from "react";
import Image from "next/image";
import { SOCIAL_LOGINS } from "@/constants/auth";

type SocialLoginProps = {
  isLoading: boolean;
  onSocialLogin: (provider: string) => void;
};

export default function SocialLogin({ isLoading, onSocialLogin }: SocialLoginProps) {
  return (
    <div className="flex items-center justify-center gap-6 shrink-0">
      {SOCIAL_LOGINS.map((social) => (
        <button
          key={social.name}
          type="button"
          className={`flex items-center justify-center w-10 h-10 rounded-full border border-Gray-2 bg-transparent overflow-hidden cursor-pointer shrink-0 disabled:cursor-not-allowed disabled:opacity-60 ${
            isLoading ? "opacity-60 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
          onClick={() => onSocialLogin(social.name)}
        >
          <Image
            src={social.icon}
            alt={social.alt}
            width={40}
            height={40}
          />
        </button>
      ))}
    </div>
  );
}

