"use client";

import React, { useEffect, useState } from "react";
import { fetchMemberEmails } from "@/lib/api/admin/member";
import Toast from "@/components/base-ui/Admin/Toast";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect?: (email: string) => Promise<void> | void;
};

export default function EmailSelectModal({
  open,
  onClose,
  onSelect,
}: Props) {
  const [keyword, setKeyword] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSelecting, setIsSelecting] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setKeyword("");
    setEmails([]);
    setLoading(false);
    setIsSelecting(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await fetchMemberEmails(keyword, 20);
        const resultEmails = res.result.emails ?? [];

        setEmails(resultEmails);

        if (keyword.trim() && resultEmails.length === 0) {
          setToastMessage("해당 이메일의 멤버가 없습니다.");
        }
      } catch (err) {
        console.error("이메일 검색 실패", err);
        setEmails([]);
        if (keyword.trim()) {
          setToastMessage("멤버 검색 실패");
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, open]);

  const handleCloseToast = () => {
    setToastMessage("");
  };

  const handleSelect = async (email: string) => {
    try {
      setIsSelecting(email);
      await onSelect?.(email);
      setToastMessage("멤버 선택 성공");
      onClose();
    } catch (error) {
      console.error("멤버 선택 실패", error);
      setToastMessage("멤버 선택 실패");
    } finally {
      setIsSelecting(null);
    }
  };

  if (!open && !toastMessage) return null;

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={onClose}
            aria-hidden
          />

          {/* modal */}
          <div
            className="
              absolute left-1/2
              -translate-x-1/2
              bg-white
              rounded-[8px]
              shadow-[0_10px_30px_rgba(0,0,0,0.15)]
              overflow-hidden
              flex flex-col
            "
            style={{
              top: "100px",
              width: "1180px",
              height: "80vh",
              maxWidth: "92vw",
            }}
          >
            {/* header */}
            <div className="relative h-[36px] shrink-0 pb-[24px]">
              <button
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="
                  absolute right-[18px] top-[8px]
                  h-[28px] w-[28px]
                  grid place-items-center
                  rounded-[6px]
                  hover:bg-black/5
                "
              >
                <span className="text-[18px] leading-none text-[var(--Black)]">
                  ✕
                </span>
              </button>
            </div>

            {/* search */}
            <div className="px-[36px] shrink-0">
              <div className="mx-auto w-[1040px]">
                <div className="relative">
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="검색 하기 (소식 등록 요청 회원 이메일)"
                    className="
                      w-full h-[54px]
                      rounded-[8px]
                      border border-[rgba(0,0,0,0.08)]
                      bg-white
                      px-[18px] pr-[54px]

                      subhead_4_1
                      text-Gray-7
                      placeholder:text-Gray-3

                      outline-none
                      focus:ring-2 focus:ring-black/10
                    "
                  />

                  <div className="pointer-events-none absolute right-[18px] top-1/2 -translate-y-1/2 text-black/45">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M16.5 16.5 21 21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* list */}
            <div className="px-[36px] mt-[57px] pb-[22px] flex-1 overflow-y-auto">
              <ul className="mx-auto w-[1040px]">
                {loading && (
                  <li className="py-10 text-center text-[13px] text-black/45">
                    불러오는 중...
                  </li>
                )}

                {!loading &&
                  emails.map((email, idx) => (
                    <li
                      key={`${email}-${idx}`}
                      className="
                        flex
                        w-[1040px] h-[48px]
                        border-b border-[rgba(0,0,0,0.06)]
                      "
                    >
                      <div
                        className="
                          flex-1
                          flex items-center
                          pl-[12px]
                          body_1_2
                          text-Gray-7
                          truncate
                        "
                        title={email}
                      >
                        {email}
                      </div>

                      <div className="w-[112px] shrink-0 h-full flex items-center justify-center">
                        <button
                          type="button"
                          disabled={isSelecting === email}
                          className="
                            body_1_2
                            text-Gray-7
                            underline
                            hover:opacity-70
                            disabled:opacity-50
                          "
                          onClick={() => handleSelect(email)}
                        >
                          선택하기
                        </button>
                      </div>
                    </li>
                  ))}

                {!loading && emails.length === 0 && (
                  <li className="py-10 text-center text-[13px] text-black/45">
                    검색 결과가 없습니다.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <Toast message={toastMessage} onClose={handleCloseToast} />
      )}
    </>
  );
}