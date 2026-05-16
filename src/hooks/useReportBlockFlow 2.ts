import { useState } from "react";
import { showCustomToast } from "@/utils/toastUtils";

type ModalStep = "none" | "selection" | "report" | "block";

export function useReportBlockFlow(onReportSubmit: (type: string, content: string) => void) {
  const [modalStep, setModalStep] = useState<ModalStep>("none");

  const openSelection = () => setModalStep("selection");
  const closeAll = () => setModalStep("none");

  const selectReport = () => setModalStep("report");
  const selectBlock = () => setModalStep("block");

  const handleReportSubmit = (type: string, content: string) => {
    onReportSubmit(type, content);
    closeAll();
  };

  const handleBlockConfirm = () => {
    // API Call goes here (TODO: Implement server API)
    // await blockMember({ targetId });

    closeAll();
    
    showCustomToast("차단이 완료되었습니다.");
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
