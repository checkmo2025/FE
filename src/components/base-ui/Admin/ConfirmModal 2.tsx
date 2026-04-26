"use client";

import { useEffect } from "react";
import { useScrollLock } from "@/hooks/useScrollLock";

type ConfirmModalProps = {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }: ConfirmModalProps) {
    useScrollLock(isOpen);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onCancel();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <>
            {/* 백그라운드 딤 */}
            <div
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
                onClick={onCancel}
            >
                {/* 모달 컨테이너 */}
                <div
                    className="bg-White w-full max-w-[320px] rounded-2xl p-6 shadow-xl flex flex-col gap-6 animate-slide-down"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-center flex flex-col items-center justify-center pt-2">
                        <p className="subhead_4_1 text-Gray-8 whitespace-pre-wrap">{message}</p>
                    </div>
                    <div className="flex gap-2 mt-2 w-full">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 h-[48px] rounded-lg bg-Subbrown-4 text-Gray-6 body_1_2 hover:bg-Subbrown-3 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onConfirm();
                                onCancel();
                            }}
                            className="flex-1 h-[48px] rounded-lg bg-primary-3 text-White body_1_2 hover:bg-primary-3/90 transition-colors"
                        >
                            확인
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
