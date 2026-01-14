// src/components/base-ui/Join/TermsOfService.tsx
"use client";

import React, { useState } from "react";
import JoinButton from "../JoinButton";
import JoinHeader from "../JoinHeader";

const TermsOfService = () => {
  const [agreements, setAgreements] = useState({
    servicePrivacy: false, // 서비스 이용을 위한 필수 개인정보 수집·이용 동의 (필수)
    termsOfUse: false, // 책모 이용약관 동의 (필수)
    thirdParty: false, // 개인정보 제3자 제공 동의 (선택)
    marketing: false, // 마케팅 및 이벤트 정보 수신 동의 (선택)
  });

  const handleAgreementChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;
    setAgreements((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAllAgreementChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = event.target;
    setAgreements({
      servicePrivacy: checked,
      termsOfUse: checked,
      thirdParty: checked,
      marketing: checked,
    });
  };

  // 'allAgreed' is now a derived value, not a state.
  // This avoids the cascading render warning and the logic bug.
  const allAgreed =
    agreements.servicePrivacy &&
    agreements.termsOfUse &&
    agreements.thirdParty &&
    agreements.marketing;

  // "다음" 버튼 활성화 조건: 필수 약관 두 가지 모두 동의
  const isButtonEnabled = agreements.servicePrivacy && agreements.termsOfUse;

  return (
    <div className="flex flex-col items-center h-full py-[99px] px-14 space-y-8 rounded-lg w-full">
      <JoinHeader title="약관 동의" />

      {/* Terms Component */}
      <div className="bg-background w-full min-h-[386px] p-10 rounded-xl self-stretch flex flex-col">
        {/* Term Items */}
        <div className="pb-3 space-y-8">
          <div className="flex items-center justify-between gap-8">
            <span className="text-[#353535] text-[19.861px] font-normal leading-[0.7857]">
              서비스 이용을 위한 필수 개인정보 수집·이용 동의 (필수)
            </span>
            <input
              type="checkbox"
              name="servicePrivacy"
              checked={agreements.servicePrivacy}
              onChange={handleAgreementChange}
              className="form-checkbox"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#353535] text-[19.861px] font-normal leading-[0.7857]">
              책모 이용약관 동의 (필수)
            </span>
            <input
              type="checkbox"
              name="termsOfUse"
              checked={agreements.termsOfUse}
              onChange={handleAgreementChange}
              className="form-checkbox"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#353535] text-[19.861px] font-normal leading-[0.7857]">
              개인정보 제3자 제공 동의 (선택)
            </span>
            <input
              type="checkbox"
              name="thirdParty"
              checked={agreements.thirdParty}
              onChange={handleAgreementChange}
              className="form-checkbox"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#353535] text-[19.861px] font-normal leading-[0.7857]">
              마케팅 및 이벤트 정보 수신 동의 (선택)
            </span>
            <input
              type="checkbox"
              name="marketing"
              checked={agreements.marketing}
              onChange={handleAgreementChange}
              className="form-checkbox"
            />
          </div>
        </div>

        {/* Divider */}
        <hr className="border-t border-gray-300 my-11" />

        {/* Agree to All */}
        <div className="flex items-center justify-between">
          <span className="text-black text-[19.861px] font-normal leading-[0.7857]">
            전체동의
          </span>
          <input
            type="checkbox"
            checked={allAgreed}
            onChange={handleAllAgreementChange}
            className="form-checkbox"
          />
        </div>
      </div>

      {/* Next Button */}
      <JoinButton disabled={!isButtonEnabled}>다음</JoinButton>
    </div>
  );
};

export default TermsOfService;
