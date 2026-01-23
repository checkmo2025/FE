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
    <div className="flex flex-col items-center w-full h-full justify-between md:justify-start md:px-[clamp(32px,8vw,56px)] md:gap-[clamp(60px,10vh,100px)]">
      {/* 닫기 버튼 */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-6 right-6"
      >
        <Image src="/cancle_button.svg" alt="닫기" width={24} height={24} />
      </button>
      <div className="mt-[60px] md:mt-0">
        <JoinHeader title="약관 동의" />
      </div>{" "}
      <TermsList>
        <div className="flex flex-col gap-8 pb-3">
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

        <label className="items-center justify-between hidden w-full cursor-pointer select-none md:flex">
          <span className="text-[#000000] text-[19.861px] font-normal leading-[15.605px]">
            <span className="hidden md:inline">전체동의</span>
          </span>
          <div className="relative flex items-center justify-center w-[24px] h-[24px]">
            <input
              type="checkbox"
              id="allAgreed"
              checked={allAgreed}
              onChange={handleAllAgreementChange}
              className="sr-only peer"
              disabled={false} // 모바일에서 숨겨지더라도 기능은 유지하거나, 필요시 disabled 처리
            />
            <div className="w-full h-full peer-checked:hidden">
              <Image
                src="/CheckBox_No.svg"
                alt="Unchecked"
                width={24}
                height={24}
                className="hidden md:block"
              />
            </div>
            <div className="hidden w-full h-full peer-checked:block">
              <Image
                src="/CheckBox_Yes.svg"
                alt="Checked"
                width={24}
                height={24}
                className="hidden md:block"
              />
            </div>
          </div>
        </label>
      </TermsList>
      <JoinButton
        disabled={!isButtonEnabled}
        onClick={handleNext}
        className="w-[270px] mb-[40px] md:w-[526px] md:mb-0"
      >
        다음
      </JoinButton>
    </div>
  );
};

export default TermsAgreement;
