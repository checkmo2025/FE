// TermsAgreement.tsx

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import JoinLayout from "@/components/base-ui/Join/JoinLayout";
import JoinButton from "@/components/base-ui/Join/JoinButton";
import { PRIVACY_DATA } from "@/constants/setting/privacy";
import { TERMS_DATA as TERMS_OF_USE_DATA } from "@/constants/setting/terms";
import { THIRD_PARTY_DATA } from "@/constants/setting/thirdParty";
import { MARKETING_DATA } from "@/constants/setting/marketing";
import { useSignup } from "@/contexts/SignupContext";
import { memberService } from "@/services/memberService";
import { Term } from "@/types/auth";

const TERMS_CONTENT_MAP: Record<string, { title: string; content: string | string[] }[]> = {
  PRIVACY_COLLECTION: PRIVACY_DATA,
  SERVICE_TERMS: TERMS_OF_USE_DATA,
  THIRD_PARTY_PROVISION: THIRD_PARTY_DATA,
  MARKETING: MARKETING_DATA,
};

interface TermsAgreementProps {
  onNext: () => void;
}

const TermsAgreement: React.FC<TermsAgreementProps> = ({ onNext }) => {
  const { agreements, setAgreements, isSocial, showToast } = useSignup();
  const [termsData, setTermsData] = useState<Term[]>([]);
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const { terms } = await memberService.getTerms();
        setTermsData(terms);

        if (isSocial) {
          try {
            const myTerms = await memberService.getMyTerms();
            
            // 필수 약관에 이미 동의했다면 바로 넘어갑니다
            if (!myTerms.requiresRequiredAgreement) {
              onNext();
              return;
            }

            const newAgreements: Record<number, boolean> = {};
            myTerms.terms.forEach(term => {
              newAgreements[term.id] = term.agreed;
            });
            setAgreements(newAgreements);
          } catch (e) {
            console.error("Failed to fetch my terms", e);
            // Ignore error, user will start fresh
          }
        } else {
          // Initialize agreements if not already set
          if (Object.keys(agreements).length === 0) {
            const initialAgreements: Record<number, boolean> = {};
            terms.forEach(term => {
              initialAgreements[term.id] = false;
            });
            setAgreements(initialAgreements);
          }
        }
      } catch (error) {
        showToast("약관을 불러오는데 실패했습니다.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchTerms();
  }, [isSocial, onNext, setAgreements, showToast]);

  const allAgreed = termsData.length > 0 && termsData.every((term) => agreements[term.id]);
  const isButtonEnabled = termsData.length > 0 && termsData.filter((term) => term.required).every(
    (term) => agreements[term.id]
  );

  const handleNext = async () => {
    if (!isButtonEnabled || isSubmitting) return;

    if (isSocial) {
      setIsSubmitting(true);
      try {
        const payload = {
          agreements: termsData.map((term) => ({
            termsId: term.id,
            agreed: !!agreements[term.id],
          })),
        };
        await memberService.saveMyTerms(payload);
        onNext();
      } catch (error: unknown) {
        if (error instanceof Error) {
          showToast(error.message || "약관 동의 저장에 실패했습니다.");
        } else {
          showToast("약관 동의 저장에 실패했습니다.");
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      onNext();
    }
  };

  const handleAgreementChange = (id: number, checked: boolean) => {
    setAgreements({ ...agreements, [id]: checked });
  };

  const handleAllAgreementChange = () => {
    const checked = !allAgreed;
    const newAgreements = termsData.reduce((acc, term) => {
      acc[term.id] = checked;
      return acc;
    }, {} as Record<number, boolean>);
    setAgreements(newAgreements);
  };

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
    const selectedTerm = termsData.find(t => t.id === selectedTermId);
    const termDataContent = selectedTerm ? TERMS_CONTENT_MAP[selectedTerm.termsType] : null;

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
                  {selectedTerm?.termUrl && (
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
