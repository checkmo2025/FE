import { useState, useEffect, useCallback } from "react";
import { memberService } from "@/services/memberService";
import { Term } from "@/types/auth";
import { useSignup } from "@/contexts/SignupContext";

export const useTermsAgreement = (onNext: () => void) => {
  const { agreements, setAgreements, isSocial, showToast } = useSignup();
  const [termsData, setTermsData] = useState<Term[]>([]);
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
          }
        } else {
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
  }, [isSocial, onNext, setAgreements, showToast]); // eslint-disable-line react-hooks/exhaustive-deps

  const allAgreed = termsData.length > 0 && termsData.every((term) => agreements[term.id]);
  const isButtonEnabled = termsData.length > 0 && termsData.filter((term) => term.required).every(
    (term) => agreements[term.id]
  );

  const handleNext = useCallback(async () => {
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
  }, [isButtonEnabled, isSubmitting, isSocial, termsData, agreements, onNext, showToast]);

  const handleAgreementChange = useCallback((id: number, checked: boolean) => {
    setAgreements({ ...agreements, [id]: checked });
  }, [agreements, setAgreements]);

  const handleAllAgreementChange = useCallback(() => {
    const checked = !allAgreed;
    const newAgreements = termsData.reduce((acc, term) => {
      acc[term.id] = checked;
      return acc;
    }, {} as Record<number, boolean>);
    setAgreements(newAgreements);
  }, [allAgreed, termsData, setAgreements]);

  return {
    termsData,
    agreements,
    isFetching,
    isSubmitting,
    isButtonEnabled,
    allAgreed,
    handleAgreementChange,
    handleAllAgreementChange,
    handleNext,
  };
};
