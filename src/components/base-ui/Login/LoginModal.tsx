"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

// Components
import LoginForm from "./components/LoginForm";
import SocialLogin from "./components/SocialLogin";

// Hooks
import useLoginForm from "./hooks/useLoginForm";
import { useScrollLock } from "@/hooks/useScrollLock";

type Props = {
  onClose: () => void;
  onSignUp?: () => void;
};

export default function LoginModal({ onClose, onSignUp }: Props) {
  const router = useRouter();
  const {
    form,
    errors,
    isLoading,
    handleChange,
    handleLogin,
    handleSocialLogin,
    handleKeyDown,
  } = useLoginForm(onClose);

  // Body scroll lock
  useScrollLock();

  const handleSignUp = () => {
    if (onSignUp) onSignUp();
    router.push("/signup");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center justify-start t:justify-center w-[290px] h-[430px] t:w-[379px] t:h-[520px] px-10 py-5 t:p-10 gap-6 rounded-lg border border-Subbrown-4 bg-White overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-[14px] right-[14px] t:top-[23px] t:right-4 w-6 h-6 cursor-pointer z-10 bg-transparent border-none p-0 text-primary-1"
        >
          <Image src="/cancle_button.svg" alt="닫기" width={24} height={24} />
        </button>

        {/* 로고 영역 */}
        <div className="flex flex-col items-center shrink-0">
          <Image
            src="/Vector.svg"
            alt="CheckMo Logo"
            width={76}
            height={46}
            className="w-[76.607px] h-[46.815px] shrink-0"
          />
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex flex-col items-center w-full gap-10 shrink-0">
          <div className="flex flex-col items-center w-full gap-4 shrink-0">
            {/* 로그인 폼 (이메일, 비밀번호, 버튼 등) */}
            <LoginForm
              form={form}
              errors={errors}
              isLoading={isLoading}
              onChange={handleChange}
              onLogin={handleLogin}
              onKeyDown={handleKeyDown}
              onClose={onClose}
            />

            {/* 소셜 로그인 */}
            <SocialLogin
              isLoading={isLoading}
              onSocialLogin={handleSocialLogin}
            />
          </div>

          {/* 하단 안내 문구 */}
          <p className="text-center text-[12px] text-Gray-4 shrink-0">
            아직 회원이 아니신가요?{" "}
            <span
              className="underline underline-offset-auto cursor-pointer"
              onClick={handleSignUp}
            >
              회원가입하러가기
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}



