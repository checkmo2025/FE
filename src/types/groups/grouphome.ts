export type ClubCategoryCode =
  | 'HUMANITIES'
  | 'COMPUTER_IT'
  | 'ESSAY'
  | 'HISTORY_CULTURE'
  | string;

export interface ClubCategory {
  code: ClubCategoryCode;
  description: string;
}

export type ParticipantTypeCode =
  | 'OFFLINE'
  | 'ONLINE'
  | 'WORKER'
  | 'STUDENT'
  | 'CLUB'
  | 'MEETING'
  | string;

export interface ParticipantType {
  code: ParticipantTypeCode;
  description: string;
}

export interface ClubRecentNotice {
  noticeId: number;
  title: string;
  createdAt: string; // ISO string 추천
  url: string; // 공지 이동 링크
}

export interface ClubLinks {
  joinUrl: string;
  contactUrl?: string;
}

export interface ClubModalLink {
  id?: number;
  url: string;
}

export interface ClubHomeResponseResult {
  clubId: number;
  name: string;
  profileImageUrl: string | null;
  region: string | null;
  category: ClubCategory[];
  participantTypes: ParticipantType[];
  open: boolean;


  description?: string;
  recentNotice?: ClubRecentNotice;
  links?: ClubLinks;

  modalLinks?: ClubModalLink[];
}


export interface ClubHomeResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ClubHomeResponseResult;
}

