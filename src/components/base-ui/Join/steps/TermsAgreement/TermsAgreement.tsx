// TermsAgreement.tsx

"use client";

import React from "react";
import Image from "next/image";
import JoinLayout from "@/components/base-ui/Join/JoinLayout";
import JoinButton from "@/components/base-ui/Join/JoinButton";
import { useSignup } from "@/contexts/SignupContext";

export const TERMS_DATA = [
  {
    id: "servicePrivacy",
    label: "서비스 이용을 위한 필수 개인정보 수집·이용 동의 (필수)",
    required: true,
  },
  { id: "termsOfUse", label: "책모 이용약관 동의 (필수)", required: true },
  { id: "thirdParty", label: "개인정보 제3자 제공 동의 (선택)", required: false },
  {
    id: "marketing",
    label: "마케팅 및 이벤트 정보 수신 동의 (선택)",
    required: false,
  },
];

interface TermsAgreementProps {
  onNext: () => void;
}

const TermsAgreement: React.FC<TermsAgreementProps> = ({ onNext }) => {
  const { agreements, setAgreements } = useSignup();

  const allAgreed = TERMS_DATA.every((term) => agreements[term.id]);
  const isButtonEnabled = TERMS_DATA.filter((term) => term.required).every(
    (term) => agreements[term.id]
  );

  const handleNext = () => {
    onNext();
  };

  const handleAgreementChange = (id: string, checked: boolean) => {
    setAgreements({ ...agreements, [id]: checked });
  };

  const handleAllAgreementChange = () => {
    const checked = !allAgreed;
    const newAgreements = TERMS_DATA.reduce((acc, term) => {
      acc[term.id] = checked;
      return acc;
    }, {} as Record<string, boolean>);
    setAgreements(newAgreements);
  };

  return (
    <JoinLayout title="약관 동의">
      <div className="flex flex-col items-center w-full gap-[40px]">
        {/* 약관 동의 박스 Frame */}
        <div className="flex flex-col justify-center w-[270px] h-[297px] px-[24px] gap-[24px] rounded-[12px] bg-background t:w-[584px] t:h-[386px] t:px-[40px] t:pt-[24px] t:pb-[36px]">
          {/* 개별 약관 리스트 */}
          <div className="flex flex-col gap-[20px]">
            {TERMS_DATA.map((term) => (
              <div
                key={term.id}
                className="flex items-center justify-between w-full cursor-pointer"
                onClick={() =>
                  handleAgreementChange(term.id, !agreements[term.id])
                }
              >
                <span className="text-[#353535] font-sans text-[12px] font-normal leading-[145%] tracking-[-0.012px] t:text-[19.861px] t:leading-[15.605px]">
                  {term.label}
                </span>
                <div className="relative w-[15px] h-[15px] shrink-0 t:w-[24px] t:h-[24px]">
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
          disabled={!isButtonEnabled}
          onClick={handleNext}
          className="w-[270px] t:w-[526px]"
        >
          다음
        </JoinButton>
      </div>
    </JoinLayout>
  );
};

export default TermsAgreement;
