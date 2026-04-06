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
}
