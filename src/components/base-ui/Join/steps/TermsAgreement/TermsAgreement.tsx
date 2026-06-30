// TermsAgreement.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import JoinLayout from "@/components/base-ui/Join/JoinLayout";
import JoinButton from "@/components/base-ui/Join/JoinButton";
import { useTermsAgreement } from "./useTermsAgreement";
import TermsDetailModal from "./TermsDetailModal";

interface TermsAgreementProps {
  onNext: () => void;
}

const TermsAgreement: React.FC<TermsAgreementProps> = ({ onNext }) => {
  const {
    termsData,
    agreements,
    isFetching,
    isSubmitting,
    isButtonEnabled,
    allAgreed,
    handleAgreementChange,
    handleAllAgreementChange,
    handleNext,
  } = useTermsAgreement(onNext);

  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);

  if (isFetching) {
    return (
      <JoinLayout title="약관 동의">
        <div className="flex flex-col items-center w-full">
          <p className="text-Gray-5">약관을 불러오는 중입니다...</p>
        </div>
      </JoinLayout>
    );
  }

  if (selectedTermId !== null) {
    const selectedTerm = termsData.find((t) => t.id === selectedTermId);

    if (selectedTerm) {
      return (
        <JoinLayout title="약관 동의">
          <TermsDetailModal
            selectedTerm={selectedTerm}
            onClose={() => setSelectedTermId(null)}
            onAgree={() => {
              handleAgreementChange(selectedTermId, true);
              setSelectedTermId(null);
            }}
          />
        </JoinLayout>
      );
    }
  }

  return (
    <JoinLayout title="약관 동의">
      <div className="flex flex-col items-center w-full gap-[40px]">
        {/* 약관 동의 박스 Frame */}
        <div className="flex flex-col justify-center w-[270px] h-[297px] px-[24px] gap-[24px] rounded-[12px] bg-background t:w-[584px] t:h-[386px] t:px-[40px] t:pt-[24px] t:pb-[36px]">
          {/* 개별 약관 리스트 */}
          <div className="flex flex-col gap-[20px]">
            {termsData.map((term) => (
              <div
                key={term.id}
                className="flex items-center justify-between w-full gap-[12px]"
              >
                <span
                  className="flex-1 text-[#353535] font-sans text-[12px] font-normal leading-[145%] tracking-[-0.012px] t:text-[19.861px] t:leading-[15.605px] cursor-pointer hover:underline pr-[4px]"
                  onClick={() => setSelectedTermId(term.id)}
                >
                  {term.title}
                </span>
                <div
                  className="relative w-[15px] h-[15px] shrink-0 t:w-[24px] t:h-[24px] cursor-pointer"
                  onClick={() => handleAgreementChange(term.id, !agreements[term.id])}
                >
                  <Image
                    src={
                      agreements[term.id]
                        ? "/CheckBox_Yes.svg"
                        : "/CheckBox_No.svg"
                    }
                    alt="checkbox"
                    fill
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 구분선 (vector 129) */}
          <div className="w-[190px] h-[1px] bg-Gray-2 my-[8px] mx-auto t:w-[504px]" />

          {/* 전체 동의 */}
          <div
            className="flex items-center justify-between w-full cursor-pointer"
            onClick={handleAllAgreementChange}
          >
            <span className="text-Black font-sans text-[12px] font-normal leading-[145%] tracking-[-0.012px] t:text-[19.861px] t:leading-[15.605px]">
              전체동의
            </span>
            <div className="relative w-[15px] h-[15px] shrink-0 t:w-[24px] t:h-[24px]">
              <Image
                src={allAgreed ? "/CheckBox_Yes.svg" : "/CheckBox_No.svg"}
                alt="checkbox"
                fill
              />
            </div>
          </div>
        </div>

        <JoinButton
          disabled={!isButtonEnabled || isSubmitting}
          onClick={handleNext}
          className="w-[270px] t:w-[526px]"
        >
          {isSubmitting ? "처리 중..." : "다음"}
        </JoinButton>
      </div>
    </JoinLayout>
  );
};

export default TermsAgreement;
