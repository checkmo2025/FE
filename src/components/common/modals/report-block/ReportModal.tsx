"use client";

import { useEffect, useState } from "react";
import { useScrollLock } from "@/hooks/useScrollLock";
import Image from "next/image";
import { REPORT_REASONS } from "@/constants/report";
import { ReportReason } from "@/types/report";

type ReportModalProps = {
    isOpen: boolean;
    onClose: () => void;
    /** 선택한 신고 사유(reason)와 내용을 전달 */
    onSubmit: (reason: ReportReason, content: string) => void;
    defaultReason?: ReportReason | null;
};

export default function ReportModal({ isOpen, onClose, onSubmit, defaultReason = null }: ReportModalProps) {
    const [reason, setReason] = useState<ReportReason | null>(defaultReason);
    const [reportContent, setReportContent] = useState("");

    const isSubmitEnabled = reason !== null && reportContent.trim().length > 0;

    useScrollLock(isOpen);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            setReason(defaultReason);
        } else {
            // Reset state when closed
            setReason(defaultReason);
            setReportContent("");
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose, defaultReason]);

    if (!isOpen) return null;

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= 400) {
            setReportContent(e.target.value);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            {/* Modal Container */}
            <div
                className="flex w-full max-w-[734px] p-5 t:p-[40px] flex-col items-start gap-[16px] rounded-[8px] border border-Subbrown-4 bg-background animate-slide-down"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header: Title and Close button */}
                <div className="flex px-[20px] justify-between items-start self-stretch">
                    <h2 className="text-Gray-7 subhead_2">신고하기</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-[32px] h-[32px] relative cursor-pointer"
                    >
                        <Image src="/reportCancle.svg" alt="닫기" fill />
                    </button>
                </div>

                {/* Body: Report Reason and Content */}
                <div className="flex px-[20px] flex-col justify-center items-center gap-[24px] self-stretch">

                    {/* Report Reason Section */}
                    <div className="flex flex-col items-start gap-[8px] self-stretch">
                        <span className="self-stretch text-Gray-3 body_1_3">사유</span>
                        <div className="flex items-center gap-[12px] self-stretch">
                            {REPORT_REASONS.map(({ label, value }) => {
                                const isSelected = reason === value;
                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setReason(value)}
                                        className={`flex w-[144px] h-[45px] p-[10px] justify-center items-center gap-[10px] rounded-[8px] border transition-colors ${isSelected
                                            ? "border-primary-1 bg-primary-1 text-White"
                                            : "border-Gray-2 bg-Gray-1 text-Gray-3"
                                            }`}
                                    >
                                        <span className="subhead_4_1">{label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Report Content Section */}
                    <div className="flex flex-col items-start gap-[8px] self-stretch">
                        <span className="self-stretch text-Gray-3 body_1_3">내용</span>
                        <textarea
                            value={reportContent}
                            onChange={handleContentChange}
                            placeholder="신고 내용 작성 (최대 400자)"
                            className="flex h-[284px] p-[20px] items-start gap-[10px] self-stretch rounded-[8px] bg-White border-none resize-none focus:outline-none focus:ring-1 focus:ring-primary-1 text-Gray-7 subhead_4_1 placeholder:text-Gray-3"
                        />
                    </div>

                    {/* Submit CTA Section */}
                    <div className="flex w-full flex-col items-start gap-[8px]">
                        <button
                            type="button"
                            disabled={!isSubmitEnabled}
                            onClick={() => {
                                if (reason && isSubmitEnabled) {
                                    onSubmit(reason, reportContent);
                                    onClose();
                                }
                            }}
                            className={`flex h-[56px] p-[20px] justify-center items-center gap-[10px] self-stretch rounded-[8px] transition-colors pb-[20px] ${isSubmitEnabled
                                ? "bg-primary-1 text-White hover:bg-primary-1/90 cursor-pointer"
                                : "bg-Gray-1 text-Gray-3 cursor-not-allowed"
                                }`}
                        >
                            <span className="text-[18px] font-normal leading-[135%] tracking-[-0.018px]">
                                신고 등록
                            </span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
