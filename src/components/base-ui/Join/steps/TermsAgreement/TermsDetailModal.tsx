import React from "react";
import JoinButton from "@/components/base-ui/Join/JoinButton";
import { PRIVACY_DATA } from "@/constants/setting/privacy";
import { TERMS_DATA as TERMS_OF_USE_DATA } from "@/constants/setting/terms";
import { THIRD_PARTY_DATA } from "@/constants/setting/thirdParty";
import { MARKETING_DATA } from "@/constants/setting/marketing";
import { Term } from "@/types/auth";

const TERMS_CONTENT_MAP: Record<string, { title: string; content: string | string[] }[]> = {
  PRIVACY_COLLECTION: PRIVACY_DATA,
  SERVICE_TERMS: TERMS_OF_USE_DATA,
  THIRD_PARTY_PROVISION: THIRD_PARTY_DATA,
  MARKETING: MARKETING_DATA,
};

interface TermsDetailModalProps {
  selectedTerm: Term;
  onClose: () => void;
  onAgree: () => void;
}

const TermsDetailModal: React.FC<TermsDetailModalProps> = ({ selectedTerm, onClose, onAgree }) => {
  const termDataContent = TERMS_CONTENT_MAP[selectedTerm.termsType];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative flex flex-col items-center justify-between w-[272px] t:w-[654px] h-[580px] t:h-[645px] max-h-[80vh] px-[12px] py-[30px] t:py-[80px] rounded-[8px] border border-[#BBAA9B] bg-white shadow-[2px_4px_4px_0_rgba(0,0,0,0.25)] transition-all">
        <button
          onClick={onClose}
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
              {termDataContent ? (
                termDataContent.map((term, i) => (
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
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-Gray-5">
                  <p>약관 내용을 불러올 수 없습니다.</p>
                </div>
              )}
              {selectedTerm.termUrl && (
                <div className="flex justify-center w-full mt-4 pb-4">
                  <a 
                    href={selectedTerm.termUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[14px] text-[#BBAA9B] underline hover:text-[#9c8e80]"
                  >
                    새 창으로 보기
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        <JoinButton
          onClick={onAgree}
          className="w-full t:w-[526px] h-[48px] px-[16px] py-[12px] mt-[20px] t:mt-[24px] shrink-0 font-sans text-[14px] font-semibold leading-[145%] tracking-[-0.014px]"
        >
          동의
        </JoinButton>
      </div>
    </div>
  );
};

export default TermsDetailModal;
