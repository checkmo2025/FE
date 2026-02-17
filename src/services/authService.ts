import { apiClient } from "@/lib/api/client";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints";
import {
  LoginForm,
  LoginResponse,
  ApiResponse,
  EmailVerificationConfirm,
  AdditionalInfo,
  SignupForm,
  User
} from "@/types/auth";

export const authService = {
  login: async (data: LoginForm): Promise<LoginResponse> => {
    return await apiClient.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, data);
  },

  signup: async (data: SignupForm): Promise<ApiResponse<User>> => {
    return await apiClient.post<ApiResponse<User>>(AUTH_ENDPOINTS.SIGNUP, data);
  },

  verifyEmail: async (email: string, type: string = "SIGN_UP"): Promise<ApiResponse<string>> => {
    return await apiClient.post<ApiResponse<string>>(
      AUTH_ENDPOINTS.EMAIL_VERIFICATION,
      null,
      { params: { email, type } }
    );
  },

  confirmEmail: async (data: EmailVerificationConfirm): Promise<ApiResponse<boolean>> => {
    return await apiClient.post<ApiResponse<boolean>>(AUTH_ENDPOINTS.EMAIL_CONFIRM, data);
  },

  checkNickname: async (nickname: string): Promise<ApiResponse<boolean>> => {
    return await apiClient.post<ApiResponse<boolean>>(AUTH_ENDPOINTS.CHECK_NICKNAME, null, {
      params: { nickname }
    });
  },

  additionalInfo: async (data: AdditionalInfo): Promise<ApiResponse> => {
    return await apiClient.post<ApiResponse>(AUTH_ENDPOINTS.ADDITIONAL_INFO, data);
  },
};
