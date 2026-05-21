import { useState } from "react";
import { showCustomToast } from "@/utils/toastUtils";

type ModalStep = "none" | "selection" | "report" | "block";

export function useReportBlockFlow(
  onReportSubmit: (type: string, content: string) => void,
  onBlockSubmit?: () => Promise<void>
) {
  const [modalStep, setModalStep] = useState<ModalStep>("none");

  const openSelection = () => setModalStep("selection");
  const closeAll = () => setModalStep("none");

  const selectReport = () => setModalStep("report");
  const selectBlock = () => setModalStep("block");

  const handleReportSubmit = (type: string, content: string) => {
    onReportSubmit(type, content);
    closeAll();
  };

  const handleBlockConfirm = async () => {
    try {
      // API 호출이 주입된 경우 await 처리 (리뷰 반영: 성공 시에만 토스트 노출)
      if (onBlockSubmit) {
        await onBlockSubmit();
      }

      closeAll();
      // showCustomToast는 useBlockMemberMutation.onSuccess에서 이미 호출되므로 여기서 제거
    } catch (error) {
      console.error("Block action failed:", error);
      // 필요 시 에러 토스트 추가 가능
    }
  };

  return {
    modalStep,
    openSelection,
    closeAll,
    selectReport,
    selectBlock,
    handleReportSubmit,
    handleBlockConfirm,
  };
}
