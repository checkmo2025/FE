"use client";

import { useEffect } from "react";

type ConfirmModalProps = {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }: ConfirmModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onCancel();
            }
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.addEventListener("keydown", handleEscape);
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <>
            {/* 백그라운드 딤 */}
            <div
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={onCancel}
            >
                {/* 모달 컨테이너 */}
                <div
                    className="bg-White w-full max-w-[400px] rounded-2xl p-6 shadow-lg flex flex-col gap-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-center">
                        <p className="subhead_1 text-Gray-8 whitespace-pre-wrap">{message}</p>
                    </div>
                    <div className="flex gap-3 mt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 h-[48px] rounded-lg bg-Gray-2 text-Gray-6 subhead_4_1 hover:bg-Gray-3 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onConfirm();
                                onCancel();
                            }}
                            className="flex-1 h-[48px] rounded-lg bg-primary-3 text-White subhead_4_1 hover:bg-primary-3/90 transition-colors"
                        >
                            확인
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
