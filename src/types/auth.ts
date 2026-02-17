export interface User {
  email: string;
  nickname?: string;
  description?: string;
  profileImageUrl?: string;
  categories?: string[];
  profileCompleted?: boolean;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: T;
}

export interface LoginResponse extends ApiResponse<{
  email: string;
  accessToken?: string; // Optional if using cookies
}> { }

export interface EmailVerificationConfirm {
  email: string;
  verificationCode: string;
}

export interface AdditionalInfo {
  nickname: string;
  name: string;
  phoneNumber: string;
  description: string;
  imgUrl: string;
  categories: string[];
}

export interface SignupForm {
  email: string;
  password: string;
}
