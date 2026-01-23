// TermsAgreement.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import JoinHeader from "../../JoinHeader";
import JoinButton from "../../JoinButton";
import TermsList from "../TermsList";
import TermsItem from "../TermsItem";

export const TERMS_DATA = [
  {
    id: "servicePrivacy",
    label: "서비스 이용을 위한 필수 개인정보 수집·이용 동의",
    required: true,
  },
  { id: "termsOfUse", label: "책모 이용약관 동의", required: true },
  { id: "thirdParty", label: "개인정보 제3자 제공 동의", required: false },
  {
    id: "marketing",
    label: "마케팅 및 이벤트 정보 수신 동의",
    required: false,
  },
];

interface TermsAgreementProps {
  onNext: () => void;
}

const TermsAgreement: React.FC<TermsAgreementProps> = ({ onNext }) => {
  const router = useRouter();
  const initialAgreements = TERMS_DATA.reduce((acc, term) => {
    acc[term.id] = false;
    return acc;
  }, {} as Record<string, boolean>);

  const [agreements, setAgreements] = useState(initialAgreements);

  const allAgreed = TERMS_DATA.every((term) => agreements[term.id]);
  const isButtonEnabled = TERMS_DATA.filter((term) => term.required).every(
    (term) => agreements[term.id]
  );

  const handleNext = () => {
    onNext();
  };

  const handleAgreementChange = (id: string, checked: boolean) => {
    setAgreements((prev) => ({ ...prev, [id]: checked }));
  };

  const handleAllAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const newAgreements = TERMS_DATA.reduce((acc, term) => {
      acc[term.id] = checked;
      return acc;
    }, {} as Record<string, boolean>);
    setAgreements(newAgreements);
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="relative flex flex-col items-center mx-auto w-full max-w-[766px] bg-white rounded-[8px] px-6 py-10 md:px-[40px] md:py-[60px] lg:px-[56px] lg:py-[99px]">
      {/* 닫기 버튼 */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-6 right-6"
      >
        <Image src="/cancle_button.svg" alt="닫기" width={24} height={24} />
      </button>

      <JoinHeader title="약관 동의" />

      {/* Content Wrapper: Mobile -> Tablet -> Desktop Spacing */}
      <div className="flex flex-col w-full mt-10 mb-10 md:mt-[60px] md:mb-[80px] lg:mt-[90px] lg:mb-[130px]">
        <TermsList>
          <div className="flex flex-col w-full gap-8 pb-3">
            {TERMS_DATA.map((term) => (
              <TermsItem
                key={term.id}
                id={term.id}
                label={term.label}
                required={term.required}
                checked={!!agreements[term.id]}
                onChange={handleAgreementChange}
              />
            ))}
          </div>

          <div className="w-full h-[1px] bg-[#D9D9D9]" />

          {/* 전체 동의 */}
          <label className="flex items-center justify-between w-full cursor-pointer select-none">
            <span className="text-[#000000] text-[16px] md:text-[19.861px] font-normal leading-[15.605px]">
              전체동의
            </span>
            <div className="relative flex items-center justify-center w-[24px] h-[24px]">
              <input
                type="checkbox"
                id="allAgreed"
                checked={allAgreed}
                onChange={handleAllAgreementChange}
                className="sr-only peer"
              />
              <div className="w-full h-full peer-checked:hidden">
                <Image
                  src="/CheckBox_No.svg"
                  alt="Unchecked"
                  width={24}
                  height={24}
                />
              </div>
              <div className="hidden w-full h-full peer-checked:block">
                <Image
                  src="/CheckBox_Yes.svg"
                  alt="Checked"
                  width={24}
                  height={24}
                />
              </div>
            </div>
          </label>
        </TermsList>
      </div>

      <JoinButton
        disabled={!isButtonEnabled}
        onClick={handleNext}
        className="w-full md:w-[526px]"
      >
        다음
      </JoinButton>
    </div>
  );
};

export default TermsAgreement;
