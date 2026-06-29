export interface User {
  email: string;
  nickname?: string;
  name?: string;
  phoneNumber?: string;
  description?: string;
  profileImageUrl?: string;
  categories?: string[];
  profileCompleted?: boolean;
}

export interface LoginForm {
  identifier: string;
  password: string;
}

export interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: T;
}

export interface LoginResponse extends ApiResponse<string> { }

export interface EmailVerificationConfirm {
  email: string;
  verificationCode: string;
}

export interface AdditionalInfo {
  nickname: string;
  name: string;
  phoneNumber: string;
  description: string;
  profileImageUrl: string;
  categories: string[];
}

export interface SignupForm {
  email: string;
  password: string;
  agreedTermsIds: number[];
}

export interface Term {
  id: number;
  termsType: string;
  title: string;
  termUrl: string;
  version: number;
  required: boolean;
}

export interface TermsResponse {
  terms: Term[];
}

export interface MemberTerm extends Term {
  agreed: boolean;
}

export interface MemberTermsStatus {
  requiresRequiredAgreement: boolean;
  terms: MemberTerm[];
}

export interface UpdateAgreementsRequest {
  agreements: {
    termsId: number;
    agreed: boolean;
  }[];
}
