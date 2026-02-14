import { apiClient } from "@/lib/api/client";
import { LOGIN_URL } from "@/lib/api/endpoints";
import { LoginForm, LoginResponse } from "@/types/auth";

export const authService = {
  login: async (data: LoginForm): Promise<LoginResponse> => {
    return await apiClient.post<LoginResponse>(LOGIN_URL, data);
  },
};
