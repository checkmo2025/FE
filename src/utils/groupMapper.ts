import { Category, ParticipantType } from "@/app/groups/page";


/** UI 카테고리 → API participantType (전체는 필터 없음이라 null) */
const CATEGORY_TO_PARTICIPANT: Record<
  Exclude<Category, "전체">,
  ParticipantType
> = {
  대학생: "STUDENT",
  직장인: "WORKER",
  온라인: "ONLINE",
  동아리: "CLUB",
  모임: "MEETING",
  대면: "OFFLINE",
} as const;

/** API participantType → UI 카테고리 */
const PARTICIPANT_TO_CATEGORY: Record<
  ParticipantType,
  Exclude<Category, "전체">
> = {
  STUDENT: "대학생",
  WORKER: "직장인",
  ONLINE: "온라인",
  CLUB: "동아리",
  MEETING: "모임",
  OFFLINE: "대면",
} as const;

export const toParticipantType = (category: Category): ParticipantType | null => {
  if (category === "전체") return null;
  return CATEGORY_TO_PARTICIPANT[category];
};

export const toCategories = (types: ParticipantType[]) =>
  types.map((t) => PARTICIPANT_TO_CATEGORY[t]);
