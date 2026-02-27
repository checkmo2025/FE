"use client";

import { useEffect } from "react";
import Image from "next/image";

const ICON_CLOSE = "/icon_minus_1.svg";

type Props = {
  isOpen: boolean;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;

  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

export default function BookshelfDeleteConfirmModal({
  isOpen,
  isPending = false,
  onClose,
  onConfirm,
  title = "책장을 삭제할까요?",
  description = "(공지사항도 함께 삭제됩니다)",
  confirmText = "예",
  cancelText = "아니요",
}: Props) {
  // ESC 닫기 + body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
      {/* dim */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
        aria-label="닫기"
        disabled={isPending}
      />

      {/* panel */}
      <div
        role="dialog"
        aria-modal="true"
        className="
          relative w-full max-w-[360px]
          rounded-[8px]
          bg-background border border-Subbrown-4
          shadow-[0_3px_5.1px_rgba(61,52,46,0.15)]
          p-5
          flex flex-col gap-4
        "
      >
        {/* header */}
        <div className="w-full flex items-center justify-between">
          <h2 className="text-Gray-7 subhead_4_1">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 shrink-0 flex items-center justify-center hover:brightness-50"
            aria-label="닫기"
            disabled={isPending}
          >
            <Image src={ICON_CLOSE} alt="" width={24} height={24} className="object-contain" />
          </button>
        </div>

        {/* body */}
        <div className="w-full">
          <p className="text-Gray-4 body_1_2 whitespace-pre-wrap">{description}</p>
        </div>

        {/* actions */}
        <div className="w-full grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="h-[44px] rounded-[8px] bg-primary-2 text-White body_1_2 hover:brightness-95 disabled:opacity-50"
          >
            {isPending ? "삭제중..." : confirmText}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="h-[44px] rounded-[8px] border border-Subbrown-4 bg-White text-Gray-7 body_1_2 hover:brightness-95 disabled:opacity-50"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}