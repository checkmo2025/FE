"use client";

import { useEffect } from "react";
import { useScrollLock } from "@/hooks/useScrollLock";

type UnsavedChangesConfirmModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  leaveText: string;
  stayText: string;
  onLeave: () => void;
  onStay: () => void;
};

export default function UnsavedChangesConfirmModal({
  isOpen,
  title,
  description,
  leaveText,
  stayText,
  onLeave,
  onStay,
}: UnsavedChangesConfirmModalProps) {
  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onStay();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onStay]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-5">
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        aria-label="계속 작성"
        onClick={onStay}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="unsaved-changes-title"
        className="
          relative w-full max-w-[360px]
          rounded-[8px]
          border border-Subbrown-4 bg-background
          shadow-[0_3px_5.1px_rgba(61,52,46,0.15)]
          p-5
          flex flex-col gap-4
        "
      >
        <div className="flex flex-col gap-2">
          <h2 id="unsaved-changes-title" className="text-Gray-7 subhead_4_1">
            {title}
          </h2>
          <p className="text-Gray-4 body_1_2 whitespace-pre-wrap">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onLeave}
            className="h-[44px] rounded-[8px] border border-Subbrown-4 bg-White text-Gray-7 body_1_2 transition-colors hover:bg-Subbrown-3 cursor-pointer"
          >
            {leaveText}
          </button>
          <button
            type="button"
            onClick={onStay}
            className="h-[44px] rounded-[8px] bg-primary-2 text-White body_1_2 transition-colors hover:bg-primary-1 cursor-pointer"
          >
            {stayText}
          </button>
        </div>
      </div>
    </div>
  );
}
