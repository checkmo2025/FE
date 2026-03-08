"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginLogo from "@/components/base-ui/Login/LoginLogo";
import Toast from "@/components/common/Toast";

export default function AdminLoginPage() {
  const router = useRouter();

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const isDisabled = !id.trim() || !pw.trim() || loading;

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  if (isDisabled) return;

  try {
    setLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: id, password: pw }),
      }
    );

    // JSON 파싱 안전하게
    let data: { isSuccess?: boolean; message?: string } = {};
    try {
      data = await res.json();
    } catch {
      // json이 아니면 빈 객체로 처리
    }

    if (!res.ok) {
      throw new Error(data.message ?? "로그인 실패");
    }

    if (!data.isSuccess) {
      throw new Error(data.message ?? "로그인 실패");
    }

    setToastMsg("로그인 성공");
    setTimeout(() => router.push("/admin"), 800);

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "로그인 실패";
    setToastMsg(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <section className="w-[429px] text-center">

        <div className="flex flex-col items-center">
          <div className="w-[76px] h-[46px]">
            <LoginLogo />
          </div>

          <div className="mt-[24px] subhead_1 text-primary-1">
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
              border border-Subbrown-4
              bg-White
              body_1_3 outline-none
            "
            placeholder="이메일"
          />

          <input
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="
              mt-[8px]
              w-full h-[44px]
              px-[16px]
              rounded-[8px]
              border border-Subbrown-4
              bg-White
              body_1_3 outline-none
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
              body_1_1
              ${
                isDisabled
                  ? "bg-Gray-2 text-Gray-4 cursor-not-allowed"
                  : "bg-primary-1 text-White"
              }
            `}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

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