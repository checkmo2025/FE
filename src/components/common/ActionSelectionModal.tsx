"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useScrollLock } from "@/hooks/useScrollLock";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/images";

interface ActionSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReport: () => void;
  onSelectBlock: () => void;
  targetUser: {
    nickname: string;
    profileImageUrl?: string | null;
  };
}

export default function ActionSelectionModal({
  isOpen,
  onClose,
  onSelectReport,
  onSelectBlock,
  targetUser,
}: ActionSelectionModalProps) {
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
            {/* Title */}
            <h2 className="text-Gray-7 subhead_3 text-center mt-2">
              해당 사용자를 신고/차단 하시겠습니까?
            </h2>

            {/* Target User Info */}
            <div className="flex items-center justify-center px-3 py-2 gap-[10px] h-[44px]">
              <div className="relative w-6 h-6 overflow-hidden rounded-full shrink-0">
                <Image
                  src={targetUser.profileImageUrl || DEFAULT_PROFILE_IMAGE}
                  alt={`${targetUser.nickname} 프로필`}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-Gray-7 subhead_4_1 truncate max-w-[200px]">
                {targetUser.nickname}
              </span>
            </div>

            {/* Button Set */}
            <div className="flex flex-col md:flex-row items-center gap-3 w-full max-w-[504px]">
              <button
                type="button"
                onClick={onSelectReport}
                className="w-full md:flex-1 h-[48px] bg-primary-1 text-White rounded-[8px] subhead_4_1 transition-colors hover:bg-primary-1/90 md:order-2"
              >
                신고하기
              </button>
              <button
                type="button"
                onClick={onSelectBlock}
                className="w-full md:flex-1 h-[48px] bg-primary-1 border border-Subbrown-3 text-White rounded-[8px] subhead_4_1 transition-colors hover:bg-primary-1/90 md:order-3"
              >
                차단하기
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full md:flex-1 h-[48px] bg-White border border-Subbrown-3 text-Gray-5 rounded-[8px] subhead_4_1 transition-colors hover:bg-gray-50 md:order-1"
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
