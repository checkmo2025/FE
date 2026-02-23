"use client";

import { useState } from "react";
import LoginLogo from "@/components/base-ui/Login/LoginLogo";
import Toast from "@/components/common/Toast";

export default function AdminLoginPage() {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const isDisabled = !id.trim() || !pw.trim();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (isDisabled) return;

    setToastMsg("토스트 테스트");
  };

  return (
    <main className="min-h-screen bg-[#f7f3f0] flex items-center justify-center px-4">
      <section className="w-[429px] text-center">

        <div className="flex flex-col items-center">
          <div className="w-[76px] h-[46px]">
            <LoginLogo />
          </div>

          <div className="mt-[24px] text-[24px] font-semibold text-[#6b4f44]">
            관리자 로그인
          </div>
        </div>

        <form className="mt-[52px]" onSubmit={handleLogin}>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="
              w-full h-[44px]
              px-[16px]
              rounded-[8px]
              border border-[#EAE5E2]
              bg-white
              text-sm outline-none
            "
            placeholder="아이디"
          />

          <input
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="
              mt-[8px]
              w-full h-[44px]
              px-[16px]
              rounded-[8px]
              border border-[#EAE5E2]
              bg-white
              text-sm outline-none
            "
            placeholder="비밀번호"
            type="password"
          />

          <button
            type="submit"
            disabled={isDisabled}
            className={`
              mt-[32px]
              w-full h-[44px]
              rounded-[8px]
              text-sm font-semibold
              ${
                isDisabled
                  ? "bg-[#DADADA] text-[#9E9E9E] cursor-not-allowed"
                  : "bg-[#7B6154] text-white"
              }
            `}
          >
            로그인
          </button>

        </form>

        {/* Toast */}
        {toastMsg && (
          <Toast
            message={toastMsg}
            onClose={() => setToastMsg(null)}
          />
        )}

      </section>
    </main>
  );
}