export type ApplyType = "No" | "Wait" | "Yes";

export type Category =
  | "전체"
  | "대학생"
  | "직장인"
  | "온라인"
  | "동아리"
  | "모임"
  | "대면";

export type ParticipantType =
  | "STUDENT"
  | "WORKER"
  | "ONLINE"
  | "CLUB"
  | "MEETING" 
  | "OFFLINE";

// ===== Books =====
export const BOOK_CATEGORIES = [
  "여행",
  "외국어",
  "어린이/청소년",
  "종교/철학",
  "소설/시/희곡",
  "에세이",
  "인문학",
  "과학",
  "컴퓨터/IT",
  "경제/경영",
  "자기계발",
  "사회과학",
  "정치/외교/국방",
  "역사/문화",
  "예술/대중문화",
] as const;

export type BookCategory = (typeof BOOK_CATEGORIES)[number];

export const PARTICIPANTS = [
  "대학생",
  "직장인",
  "온라인",
  "동아리",
  "모임",
  "대면",
] as const;

export type ParticipantLabel = (typeof PARTICIPANTS)[number];

// 라벨 -> API enum 매핑 (타입으로 강제)
export const PARTICIPANT_LABEL_TO_TYPE: Record<ParticipantLabel, ParticipantType> = {
  "대학생": "STUDENT",
  "직장인": "WORKER",
  "온라인": "ONLINE",
  "동아리": "CLUB",
  "모임": "MEETING",
  "대면": "OFFLINE",
} as const;

// (선택) API enum -> 라벨 역매핑
export const PARTICIPANT_TYPE_TO_LABEL: Record<ParticipantType, ParticipantLabel> = {
  STUDENT: "대학생",
  WORKER: "직장인",
  ONLINE: "온라인",
  CLUB: "동아리",
  MEETING: "모임",
  OFFLINE: "대면",
} as const;
