import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "./LoginIcons";
import { LoginForm as LoginFormType } from "@/types/auth";

type LoginFormProps = {
  form: LoginFormType;
  errors: Partial<LoginFormType>;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogin: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClose: () => void;
};

export default function LoginForm({
  form,
  errors,
  isLoading,
  onChange,
  onLogin,
  onKeyDown,
  onClose,
}: LoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center w-full gap-6 shrink-0 t:gap-6">
      {/* 인풋 필드 */}
      <div className="flex flex-col items-center w-full gap-2 shrink-0">
        <input
          name="identifier"
          type="text"
          value={form.identifier}
          onChange={onChange}
          placeholder="이메일"
          className={`flex w-[228px] t:w-[300px] h-[32px] t:h-[44px] px-4 py-3 items-center rounded-lg border bg-white outline-none text-sm leading-[145%] text-Gray-7 transition-colors placeholder:text-Gray-3 disabled:cursor-not-allowed disabled:opacity-60 ${
            errors?.identifier ? "border-Red" : "border-Subbrown-4 focus:border-primary-1"
          }`}
          onKeyDown={onKeyDown}
          disabled={isLoading}
        />
        {errors?.identifier && (
          <span className="w-[228px] t:w-[300px] text-[12px] text-Red text-left">
            {errors.identifier}
          </span>
        )}

        <div className="relative flex items-center justify-center w-full">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={onChange}
            placeholder="비밀번호"
            className={`flex w-[228px] t:w-[300px] h-[32px] t:h-[44px] pl-4 pr-10 py-3 items-center rounded-lg border bg-white outline-none text-sm leading-[145%] text-Gray-7 transition-colors placeholder:text-Gray-3 disabled:cursor-not-allowed disabled:opacity-60 ${
              errors?.password ? "border-Red" : "border-Subbrown-4 focus:border-primary-1"
            }`}
            onKeyDown={onKeyDown}
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute right-[calc(50%-114px+16px)] t:right-[16px] flex items-center justify-center text-[#BBB] hover:text-[#8D8D8D] cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors?.password && (
          <span className="w-[228px] t:w-[300px] text-[12px] text-Red text-left">
            {errors.password}
          </span>
        )}
      </div>

      {/* 아이디/비번 찾기 */}
      <div className="flex items-center justify-center gap-3 cursor-pointer">
        <span
          className="text-[12px] text-Gray-5 font-medium underline underline-offset-auto t:text-Gray-4"
          onClick={() => {
            onClose();
            router.push("/find-account");
          }}
        >
          아이디 찾기
        </span>
        <span className="text-[12px] text-Gray-2">|</span>
        <span
          className="text-[12px] text-Gray-5 font-medium underline underline-offset-auto t:text-Gray-4"
          onClick={() => {
            onClose();
            router.push("/find-password");
          }}
        >
          비밀번호 찾기
        </span>
      </div>

      {/* 로그인 버튼 */}
      <button
        type="button"
        className="flex items-center justify-center w-[228px] t:w-[300px] h-[32px] t:h-[48px] rounded-lg bg-primary-1 text-White font-semibold text-sm border-none cursor-pointer transition-all active:brightness-90 disabled:bg-Gray-3 disabled:cursor-not-allowed shrink-0"
        onClick={onLogin}
        disabled={isLoading}
      >
        {isLoading ? "로그인 중..." : "로그인"}
      </button>
    </div>
  );
}



