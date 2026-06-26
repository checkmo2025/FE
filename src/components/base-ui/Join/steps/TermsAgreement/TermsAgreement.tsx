// TermsAgreement.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import JoinLayout from "@/components/base-ui/Join/JoinLayout";
import JoinButton from "@/components/base-ui/Join/JoinButton";
import { PRIVACY_DATA } from "@/constants/setting/privacy";
import { TERMS_DATA as TERMS_OF_USE_DATA } from "@/constants/setting/terms";
import { THIRD_PARTY_DATA } from "@/constants/setting/thirdParty";
import { MARKETING_DATA } from "@/constants/setting/marketing";
import { useSignup } from "@/contexts/SignupContext";

const TERMS_DATA = [
  { id: "servicePrivacy", label: "서비스 이용을 위한 필수 개인정보 수집·이용 동의 (필수)", required: true },
  { id: "termsOfUse", label: "책모 이용약관 동의 (필수)", required: true },
  { id: "thirdParty", label: "개인정보 제3자 제공 동의 (선택)", required: false },
  { id: "marketing", label: "마케팅 및 이벤트 정보 수신 동의 (선택)", required: false },
];

const TERMS_CONTENT_MAP: Record<string, { title: string; content: string | string[] }[]> = {
  servicePrivacy: PRIVACY_DATA,
  termsOfUse: TERMS_OF_USE_DATA,
  thirdParty: THIRD_PARTY_DATA,
  marketing: MARKETING_DATA,
};

interface TermsAgreementProps {
  onNext: () => void;
}

const TermsAgreement: React.FC<TermsAgreementProps> = ({ onNext }) => {
  const { agreements, setAgreements } = useSignup();
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);

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

  if (selectedTermId) {
    const termData = TERMS_CONTENT_MAP[selectedTermId];
    return (
      <JoinLayout title="약관 동의">
        <div className="flex flex-col items-center w-full">
          {/* Detailed Box: Responsive width and padding */}
          <div className="relative flex flex-col items-center justify-between w-[272px] t:w-[654px] h-[580px] t:h-[645px] max-h-[80vh] px-[12px] py-[30px] t:py-[80px] rounded-[8px] border border-[#BBAA9B] bg-white shadow-[2px_4px_4px_0_rgba(0,0,0,0.25)] transition-all">
            <button
              onClick={() => setSelectedTermId(null)}
              className="absolute right-[12px] top-[12px] w-[24px] h-[24px] flex items-center justify-center text-Gray-4 hover:text-Gray-6 transition-colors z-10"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="flex flex-col w-full h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto px-[8px] t:px-[64px] custom-scrollbar">
                <div className="flex flex-col w-full gap-6">
                  {termData.map((term, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <h3 className="text-[16px] font-semibold text-Gray-7">{term.title}</h3>
                      {Array.isArray(term.content) ? (
                        <ul className="flex list-disc flex-col gap-1 pl-5 text-[14px] text-Gray-5">
                          {term.content.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex flex-col gap-1 text-[14px] text-Gray-5">
                          {term.content.split("\n").map((line, idx) => (
                            <p key={idx}>{line.trim()}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <JoinButton
              onClick={() => {
                handleAgreementChange(selectedTermId, true);
                setSelectedTermId(null);
              }}
              className="w-full t:w-[526px] h-[48px] px-[16px] py-[12px] mt-[20px] t:mt-[24px] shrink-0 font-sans text-[14px] font-semibold leading-[145%] tracking-[-0.014px]"
            >
              동의
            </JoinButton>
          </div>
        </div>
      </JoinLayout>
    );
  }

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
                className="flex items-center justify-between w-full gap-[12px]"
              >
                <span
                  className="flex-1 text-[#353535] font-sans text-[12px] font-normal leading-[145%] tracking-[-0.012px] t:text-[19.861px] t:leading-[15.605px] cursor-pointer hover:underline pr-[4px]"
                  onClick={() => setSelectedTermId(term.id)}
                >
                  {term.label}
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
