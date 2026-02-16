// TermsAgreement.tsx

"use client";

import React, { useState } from "react";
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

const TERMS_CONTENT: Record<string, { title: string; content: string }> = {
  servicePrivacy: {
    title: "서비스 이용을 위한 필수 개인정보 수집 이용 동의(필수)",
    content: `책모는 서비스 제공을 위해 아래와 같이 개인정보를 수집·이용합니다.

### 1. 수집 항목

- 이메일 주소(아이디)
- 비밀번호
- 이름
- 전화번호
- 닉네임
- 서비스 이용 기록 (모임 참여, 콘텐츠 작성 등)
- 접속 로그 및 이용 이력

### 2. 수집·이용 목적

- 회원 식별 및 가입 의사 확인
- 책모 서비스 제공 및 운영
- 독서 모임, 콘텐츠, 커뮤니티 기능 제공
- 고객 문의 및 고객센터 응대
- 서비스 품질 개선 및 오류 분석

### 3. 보유 및 이용 기간

- 회원 탈퇴 시까지 보관
- 단, 관계 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관

### 4. 동의 거부 권리 및 불이익

- 이용자는 개인정보 수집·이용에 대한 동의를 거부할 수 있습니다.
- 다만, 필수 항목에 대한 동의를 거부할 경우 서비스 이용이 제한될 수 있습니다.
- 관련 법령: 「개인정보 보호법」 제15조`,
  },
  termsOfUse: {
    title: "책모 이용 약관",
    content: `## 제1조 (목적)
본 약관은 책모(이하 “서비스”)가 제공하는 독서 커뮤니티 플랫폼 및 관련 제반 서비스의 이용과 관련하여 서비스와 회원 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.

## 제2조 (정의)
본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
1. “서비스”란 책모가 제공하는 웹 및 애플리케이션 기반의 독서 커뮤니티, 모임, 콘텐츠 공유 등 일체의 서비스를 의미합니다.
2. “회원”이란 본 약관에 동의하고 서비스에 가입한 자를 말합니다.
3. “콘텐츠”란 회원 또는 서비스가 서비스 내에 게시한 텍스트, 이미지, 댓글, 채팅 메시지 등 일체의 정보를 의미합니다.
4. “모임”이란 회원이 생성하거나 참여할 수 있는 독서 클럽 단위의 커뮤니티를 의미합니다.

## 제3조 (약관의 효력 및 변경)
1. 본 약관은 회원이 회원가입 시 동의함으로써 효력이 발생합니다.
2. 서비스는 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수 있습니다.
3. 약관의 중요한 변경 사항은 서비스 내 공지 또는 별도 안내를 통해 고지합니다.
4. 변경된 약관에 동의하지 않을 경우, 회원은 서비스 이용을 중단하고 탈퇴할 수 있습니다.

## 제4조 (회원가입)
1. 회원가입은 이용자가 본 약관과 개인정보 처리방침에 동의하고 서비스가 정한 절차에 따라 가입을 신청함으로써 이루어집니다.
2. 서비스는 다음 경우 가입 신청을 제한할 수 있습니다.
    - 허위 정보를 기재한 경우
    - 타인의 정보를 도용한 경우
    - 기타 서비스 운영상 부적절하다고 판단되는 경우

## 제5조 (회원의 의무)
1. 회원은 관계 법령, 본 약관 및 서비스 정책을 준수해야 합니다.
2. 회원은 타인의 권리를 침해하거나 서비스 운영을 방해하는 행위를 해서는 안 됩니다.
3. 회원은 본인의 계정 정보를 안전하게 관리할 책임이 있습니다.

## 제6조 (서비스의 제공 및 변경)
1. 서비스는 독서 모임, 콘텐츠 공유, 커뮤니티 기능 등을 제공합니다.
2. 서비스는 운영상 또는 기술상 필요에 따라 제공하는 서비스의 일부 또는 전부를 변경할 수 있습니다.

## 제7조 (콘텐츠의 권리와 책임)
1. 회원이 서비스에 게시한 콘텐츠의 저작권은 해당 회원에게 귀속됩니다.
2. 회원은 서비스 운영을 위해 해당 콘텐츠를 서비스 내에서 노출, 저장, 이용하는 것을 허락합니다.
3. 회원은 타인의 저작권을 침해하는 콘텐츠를 게시해서는 안 됩니다.

## 제8조 (서비스 정책의 준용)
1. 서비스는 기능별 운영 기준을 별도의 정책집으로 정할 수 있습니다.
2. 회원은 서비스 이용 시 다음 정책을 포함한 각 기능별 운영정책을 준수해야 합니다.
    - 모임 운영정책
    - 실시간 채팅 운영정책
    - 책이야기 운영정책
    - 소식 운영정책
    - 고객센터 운영정책
3. 정책집은 본 약관의 일부로서 효력을 가집니다.

## 제9조 (서비스 이용 제한)
1. 회원이 본 약관 또는 정책을 위반한 경우, 서비스는 다음 조치를 취할 수 있습니다.
    - 서비스 이용 제한
    - 콘텐츠 삭제
    - 계정 정지 또는 탈퇴
2. 중대한 위반 행위의 경우 사전 통보 없이 조치가 이루어질 수 있습니다.

## 제10조 (회원 탈퇴)
1. 회원은 언제든지 서비스에서 탈퇴할 수 있습니다.
2. 탈퇴 시 회원의 계정 정보는 관련 법령에 따라 처리됩니다.

## 제11조 (책임의 제한)
1. 서비스는 회원 간의 자율적인 커뮤니티 활동에 개입하지 않습니다.
2. 서비스는 회원이 게시한 콘텐츠의 정확성, 신뢰성에 대해 책임을 지지 않습니다.
3. 서비스는 천재지변, 시스템 장애 등 불가항력으로 인한 서비스 제공 중단에 대해 책임을 지지 않습니다.

## 제12조 (분쟁 해결)
1. 본 약관과 관련하여 발생한 분쟁은 관계 법령에 따라 해결합니다.
2. 서비스와 회원 간 분쟁에 대해 소송이 제기될 경우 대한민국 법을 준거법으로 합니다.

## 제13조 (시행일)
본 약관은부터 2025년 12월 21일부터 시행합니다.`,
  },
  thirdParty: {
    title: "개인정보 제3자 제공 동의(선택)",
    content: `책모는 원칙적으로 회원의 개인정보를 외부에 제공하지 않습니다.

### 1. 개인정보 제3자 제공 여부
- 현재 책모는 회원의 개인정보를 제3자에게 제공하지 않습니다.

### 2. 향후 제공 가능성
- 향후 서비스 운영을 위해 개인정보를 제3자에게 제공해야 하는 경우, 제공 대상, 제공 항목, 제공 목적을 사전에 고지하고 별도의 동의를 받습니다.

### 3. 동의 거부 권리
- 본 동의는 선택 사항이며, 동의하지 않더라도 서비스 이용에는 제한이 없습니다.
- 관련 법령 :「개인정보 보호법」 제17조`,
  },
  marketing: {
    title: "마케팅 및 이벤트 정보 수신 동의 (선택)",
    content: `책모는 서비스 관련 소식 및 혜택 안내를 위해 아래와 같이 정보를 활용할 수 있습니다.

### 1. 수신 내용
- 이벤트 및 프로모션 안내
- 신규 기능 및 서비스 소식
- 독서 모임 및 콘텐츠 추천 정보

### 2. 수신 방법
- 이메일
- 서비스 내 알림

### 3. 보유 및 이용 기간
- 회원 탈퇴 또는 수신 동의 철회 시까지

### 4. 동의 거부 및 철회
- 본 동의는 선택 사항이며, 동의하지 않더라도 책모 서비스 이용에는 제한이 없습니다.
- 수신 동의는 언제든지 설정 화면을 통해 철회할 수 있습니다.
- 관련 법령 :「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 제50조`,
  },
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

  const renderMarkdown = (text: string) => {
    return text.split("\n").map((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("# ")) {
        return (
          <h1 key={index} className="text-Gray-6 font-sans text-[20px] md:text-[24px] font-bold leading-[135%] tracking-[-0.02px] mb-[16px]">
            {trimmed.replace("# ", "")}
          </h1>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={index} className="text-Gray-6 font-sans text-[18px] md:text-[20px] font-semibold leading-[135%] tracking-[-0.02px] mb-[12px] mt-[8px]">
            {trimmed.replace("## ", "")}
          </h2>
        );
      }
      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={index} className="text-Gray-6 font-sans text-[16px] md:text-[18px] font-semibold leading-[135%] tracking-[-0.018px] mb-[8px] mt-[4px]">
            {trimmed.replace("### ", "")}
          </h3>
        );
      }
      if (trimmed.startsWith("- ")) {
        return (
          <div key={index} className="flex gap-[8px] pl-[4px] mb-[4px] text-Gray-6 font-sans text-[14px] md:text-[18px] font-medium leading-[145%] md:leading-[135%] tracking-[-0.018px]">
            <span className="shrink-0">•</span>
            <span>{trimmed.replace("- ", "")}</span>
          </div>
        );
      }
      if (trimmed === "") return <div key={index} className="h-[1em]" />;
      return (
        <p key={index} className="text-Gray-6 font-sans text-[14px] md:text-[18px] font-medium leading-[145%] md:leading-[135%] tracking-[-0.018px] mb-[8px]">
          {line}
        </p>
      );
    });
  };

  if (selectedTermId) {
    const term = TERMS_CONTENT[selectedTermId];
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
                <div className="flex flex-col w-full">
                  {renderMarkdown(term.content)}
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
