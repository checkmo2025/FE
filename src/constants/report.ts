import { ReportReason } from "@/types/report";

/** 신고 사유 선택지 (모달 노출 순서) */
export const REPORT_REASONS: { label: string; value: ReportReason }[] = [
  { label: "일반", value: "GENERAL" },
  { label: "욕설/비방", value: "INSULT" },
  { label: "음란/부적절", value: "INAPPROPRIATE_CONTENT" },
  { label: "홍보/도배", value: "SPAM" },
];

/** reason 값 → 한글 라벨 */
export const REPORT_REASON_LABEL: Record<ReportReason, string> = {
  GENERAL: "일반",
  INSULT: "욕설/비방",
  INAPPROPRIATE_CONTENT: "음란/부적절",
  SPAM: "홍보/도배",
};
