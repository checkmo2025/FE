import { apiClient } from "@/lib/api/client";
import { AUTH_ENDPOINTS, API_BASE_URL } from "@/lib/api/endpoints";
import { useAuthStore } from "@/store/useAuthStore";
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

  additionalInfo: async (data: AdditionalInfo): Promise<ApiResponse<unknown>> => {
    return await apiClient.post<ApiResponse<unknown>>(AUTH_ENDPOINTS.ADDITIONAL_INFO, data);
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    return await apiClient.get<ApiResponse<User>>(AUTH_ENDPOINTS.PROFILE);
  },

  getPresignedUrl: async (type: "PROFILE" | "CLUB" | "NOTICE", fileName: string, contentType: string): Promise<ApiResponse<{ presignedUrl: string; imageUrl: string }>> => {
    return await apiClient.post<ApiResponse<{ presignedUrl: string; imageUrl: string }>>(
      `${API_BASE_URL}/image/${type}/upload-url`,
      { originalFileName: fileName, contentType }
    );
  },

  uploadToS3: async (presignedUrl: string, file: File): Promise<void> => {
    const response = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      throw new Error("S3 upload failed");
    }
  },

  logout: async () => {
    try {
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error("Backend logout failed:", error);
    } finally {
      // Best effort local cleanup
      useAuthStore.getState().logout();
    }
  },
};

