// src/types/groups/clubAdminEdit.ts

import { ApiResponse } from "@/lib/api/types";


export type CodeDescItem = {
  code: string;
  description: string;
};

export type ClubLinkItem = {
  link: string;
  label: string;
};

/**
 * [운영진] 독서 모임 상세 조회 GET /api/clubs/{clubId}
 */
export type ClubAdminDetail = {
  clubId: number;
  name: string;
  description: string;
  profileImageUrl: string | null;
  region: string;
  category: CodeDescItem[]; // [{code, description}]
  participantTypes: CodeDescItem[]; // [{code, description}]
  links: ClubLinkItem[]; // [{link, label}]
  open: boolean;
};

export type ClubAdminDetailResponse = ApiResponse<ClubAdminDetail>;

/**
 * [운영진] 독서 모임 정보 수정 PUT /api/clubs/{clubId}
 */
export type UpdateClubAdminRequest = {
  name: string;
  description: string;
  profileImageUrl: string | null;
  open: boolean;
  region: string;
  category: string[]; 
  participantTypes: string[]; 
  links: ClubLinkItem[];
};


export type UpdateClubAdminResponse = ApiResponse<ClubAdminDetail>;
