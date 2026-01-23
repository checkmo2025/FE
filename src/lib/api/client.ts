import { API_BASE_URL } from "@/lib/api/endpoints";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { getErrorMessage } from "./errorMapper";

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number; // Timeout in ms (default: 10000)
}

async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, timeout = 10000, ...fetchOptions } = options;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // [Security] Token Auto-Injection
  const token = Cookies.get("accessToken");
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  // [Utility] Query String Builder
  let requestUrl = url;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    requestUrl += `?${searchParams.toString()}`;
  }

  // [Resilience] Timeout Controller
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const config: RequestInit = {
    ...fetchOptions,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    signal: controller.signal,
  };

  try {
    const response = await fetch(requestUrl, config);
    clearTimeout(id);

    // [Resilience] Interceptor: 401 Unauthorized Handling
    if (response.status === 401) {
      console.warn("Session expired. Logging out...");
      useAuthStore.getState().logout();
      toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
      // 여기서 throw를 해서 흐름을 끊어주는 것이 안전할 수 있음
    }
    // [Resilience] Safe JSON Parsing
    let data: any;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      // JSON이 아닌 경우 (예: 500 HTML 에러 페이지 등)
      data = {
        isSuccess: false,
        message: "서버 응답 형식이 올바르지 않습니다.",
      };
    }

    // [Standardization] Response Normalization
    // HTTP Status가 200~299가 아니거나, 백엔드 로직상 실패(isSuccess: false)인 경우
    if (!response.ok || (data && data.isSuccess === false)) {
      const errorCode = data?.code || `HTTP${response.status}`;
      const errorMessage =
        data?.message ||
        getErrorMessage(errorCode) ||
        "요청 처리 중 오류가 발생했습니다.";

      // 에러 객체를 확장하여 throw
      const error: any = new Error(errorMessage);
      error.code = errorCode;
      error.response = data;
      // 비즈니스 로직에서 catch 할 수 있도록 그대로 반환하거나 throw
      // 현재 구조상 useLoginForm 등에서 data.isSuccess를 체크하므로 data를 반환
      return data as T;
    }

    return data;
  } catch (error) {
    clearTimeout(id);
    console.error("API Request Error:", error);
    // Timeout Error Handling
    if (error instanceof DOMException && error.name === "AbortError") {
      toast.error("요청 시간이 초과되었습니다.");
      throw new Error("Request timeout");
    }
    throw error;
  }
}

export const apiClient = {
  get: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "GET" }),
  post: <T>(url: string, body: any, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body: any, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "DELETE" }),
};
