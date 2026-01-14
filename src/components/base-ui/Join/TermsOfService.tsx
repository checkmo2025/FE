// src/components/base-ui/Join/TermsOfService.tsx
import React from 'react';
import Image from 'next/image';

const TermsOfService = () => {
  return (
    <div className="flex flex-col items-center h-full py-[99px] px-[56px] space-y-8 rounded-[8px] w-full">
      {/* Header Section */}
      <div className="flex flex-col items-center space-y-6">
        <Image src="/profile.svg" alt="Profile Icon" width={40} height={40} />
        <h2 className="text-2xl font-bold text-[#7B6154]">
          약관 동의
        </h2>
      </div>

      {/* Terms Component */}
      <div className="bg-[#F9F7F6] w-full min-h-[386px] p-8 rounded-[12px] self-stretch flex flex-col">
        {/* Term Items */}
        <div className="space-y-4 flex-grow">
          <div className="flex justify-between items-center">
            <span>개인정보 수집이용 동의 (필수)</span>
            <input type="checkbox" className="form-checkbox" />
          </div>
          <div className="flex justify-between items-center">
            <span>서비스 이용약관 동의 (필수)</span>
            <input type="checkbox" className="form-checkbox" />
          </div>
          <div className="flex justify-between items-center">
            <span>만 14세 이상 확인 (필수)</span>
            <input type="checkbox" className="form-checkbox" />
          </div>
          <div className="flex justify-between items-center">
            <span>이벤트, 프로모션 알림 메일/SMS 수신 동의 (선택)</span>
            <input type="checkbox" className="form-checkbox" />
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-t border-gray-300" />

        {/* Agree to All */}
        <div className="flex justify-between items-center">
          <span className="font-bold">전체동의</span>
          <input type="checkbox" className="form-checkbox" />
        </div>
      </div>

      {/* Next Button */}
      <button
        className="w-full max-w-[526px] h-[48px] p-[12px_16px] flex justify-center items-center gap-[10px] rounded-[8px] bg-[#7B6154] text-white"
      >
        다음
      </button>
    </div>
  );
};

export default TermsOfService;
