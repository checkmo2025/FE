"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useScrollLock } from "@/hooks/useScrollLock";
import { motion, AnimatePresence } from "framer-motion";

interface BlockConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmBlock: () => void;
}

export default function BlockConfirmModal({
  isOpen,
  onClose,
  onConfirmBlock,
}: BlockConfirmModalProps) {
  useScrollLock(isOpen);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 40, mass: 0.1 }}
            className="relative flex flex-col items-center justify-center w-full max-w-[580px] bg-White border-2 border-Subbrown-4 backdrop-blur-md rounded-[8px] p-6 gap-6 md:h-[220px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Warning Icon & Title */}
            <div className="flex flex-col items-center gap-2 mt-2">
              {/* Using Danger Circle.svg as specified */}
              <div className="relative w-8 h-8 md:w-10 md:h-10 mb-1">
                <Image
                  src="/Danger Circle.svg"
                  alt="경고"
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-Gray-7 subhead_3 text-center">
                정말 차단하시겠습니까?
              </h2>
              <p className="text-Gray-6 body_1_2 text-center max-w-[477px]">
                차단하면 해당 사용자의 책이야기와 프로필이 더 이상 보이지 않습니다.
              </p>
            </div>

            {/* Button Set */}
            <div className="flex flex-row items-center justify-center gap-3 w-full max-w-[332px]">
              <button
                type="button"
                onClick={onConfirmBlock}
                className="flex-1 h-[48px] bg-primary-1 text-White rounded-[8px] subhead_4_1 transition-colors hover:bg-primary-1/90"
              >
                차단
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-[48px] bg-White border border-Subbrown-3 text-Gray-5 rounded-[8px] subhead_4_1 transition-colors hover:bg-gray-50"
              >
                취소
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
