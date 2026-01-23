export interface User {
  email: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: {
    accessToken: string;
  };
}
