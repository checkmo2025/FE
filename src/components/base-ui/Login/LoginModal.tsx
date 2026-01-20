"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import LoginLogo from "./LoginLogo";

type Props = {
  onClose: () => void;
};

const SOCIAL_LOGINS = [
  { name: "google", icon: "/googleLogo.svg", alt: "구글 로그인" },
  { name: "naver", icon: "/naverLogo.svg", alt: "네이버 로그인" },
  { name: "kakao", icon: "/kakaoLogo.svg", alt: "카카오 로그인" },
];

export default function LoginModal({ onClose }: Props) {
  const [form, setForm] = useState({ id: "", password: "" });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    console.log("로그인 실행", form);
    // TODO: API 호출 로직 (form.id, form.password 사용)
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="
          relative flex flex-col items-center justify-center
          w-[379px] h-[520px]
          px-[40px] py-[20px]
          gap-[24px]
          rounded-[8px] border border-Subbrown-4 bg-White
        "
      >
        {/* 닫기 버튼 (우측 상단) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-[23px] right-[16px] w-[24px] h-[24px] cursor-pointer"
        >
          <Image src="/cancle_button.svg" alt="닫기" width={24} height={24} />
        </button>

        {/* 로고 및 안내 문구 */}
        <div className="flex flex-col items-center gap-4">
          <LoginLogo />
        </div>
        {/* 로그인 입력 폼 */}
        <div className="flex flex-col items-center gap-[10px] w-full">
          <input
            name="id"
            type="text"
            value={form.id}
            onChange={handleChange}
            placeholder="아이디"
            className="flex w-[300px] h-[44px] px-4 py-3 items-center gap-[10px] rounded-[8px] border border-Subbrown-4 bg-White outline-none body_1_3 placeholder:text-Gray-3"
            onKeyDown={handleKeyDown}
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호"
            className="flex w-[300px] h-[44px] px-4 py-3 items-center gap-[10px] rounded-[8px] border border-Subbrown-4 bg-White outline-none body_1_3 placeholder:text-Gray-3"
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-2 mt-1 cursor-pointer">
            <span className="underline text-Gray-4 body_2_2">아이디 찾기</span>
            <span className="text-Gray-2 body_2_2">|</span>
            <span className="underline text-Gray-4 body_2_2">
              비밀번호 찾기
            </span>
          </div>
          <button
            type="button"
            className="w-full h-[44px] rounded-[8px] bg-primary-1 text-white font-semibold"
            onClick={handleLogin}
          >
            로그인
          </button>
        </div>
        {/* 소셜 로그인 아이콘 영역 */}
        <div className="flex items-center gap-[24px]">
          {SOCIAL_LOGINS.map((social) => (
            <button
              key={social.name}
              type="button"
              className="flex items-center justify-center w-[40px] h-[40px] rounded-full border border-[#DADADA] overflow-hidden"
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
        {/* 회원가입 문구 */}
        <div className="flex justify-center w-full">
          <p className="text-center text-Gray-4 body_2_3">
            아직 회원이 아니신가요?{" "}
            <span className="cursor-pointer ">회원가입하러가기</span>
          </p>
        </div>
      </div>
    </div>
  );
}
