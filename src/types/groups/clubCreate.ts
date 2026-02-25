// src/types/groups/clubCreate.ts
import type { BookCategory, ParticipantType } from "@/types/groups/groups";


export type ClubLink = {
  link: string;
  label: string;
};

export type CreateClubRequest = {
  name: string;
  description: string;
  profileImageUrl: string | null; // 없으면 null로 보내는 게 깔끔
  region: string;
  category: ClubCategoryCode[];
  participantTypes: ParticipantType[];
  links: ClubLink[];
  open: boolean;
};


// src/types/groups/clubCreate.ts

export type ClubCategoryCode =
  | "FICTION_POETRY_DRAMA"
  | "ESSAY"
  | "HUMANITIES"
  | "SOCIAL_SCIENCE"
  | "POLITICS_DIPLOMACY_DEFENSE"
  | "ECONOMY_MANAGEMENT"
  | "SELF_DEVELOPMENT"
  | "HISTORY_CULTURE"
  | "SCIENCE"
  | "COMPUTER_IT"
  | "ART_POP_CULTURE"
  | "TRAVEL"
  | "FOREIGN_LANGUAGE"
  | "CHILDREN_BOOKS"
  | "RELIGION_PHILOSOPHY";

export const BOOK_CATEGORY_TO_CODE: Record<BookCategory, ClubCategoryCode> = {
  "여행": "TRAVEL",
  "외국어": "FOREIGN_LANGUAGE",
  "어린이/청소년": "CHILDREN_BOOKS",       
  "종교/철학": "RELIGION_PHILOSOPHY",
  "소설/시/희곡": "FICTION_POETRY_DRAMA",
  "에세이": "ESSAY",
  "인문학": "HUMANITIES",
  "사회과학": "SOCIAL_SCIENCE",             
  "정치/외교/국방": "POLITICS_DIPLOMACY_DEFENSE",
  "경제/경영": "ECONOMY_MANAGEMENT",        
  "자기계발": "SELF_DEVELOPMENT",           
  "역사/문화": "HISTORY_CULTURE",
  "과학": "SCIENCE",
  "컴퓨터/IT": "COMPUTER_IT",
  "예술/대중문화": "ART_POP_CULTURE",      
};

export function mapBookCategoriesToCodes(categories: BookCategory[]) {
  return categories.map((c) => BOOK_CATEGORY_TO_CODE[c]);
}