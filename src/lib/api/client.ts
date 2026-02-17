import { API_BASE_URL } from "@/lib/api/endpoints";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { getErrorMessage } from "./errorMapper";
import { ApiError } from "./ApiError";

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
    // [Security] Include credentials (cookies) for all requests
    credentials: "include",
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
    }

    // [Resilience] Safe JSON Parsing
    let data: any;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = {
        isSuccess: false,
        message: "서버 응답 형식이 올바르지 않습니다.",
      };
    }

    // [Standardization] Response Normalization
    if (!response.ok || (data && data.isSuccess === false)) {
      const errorCode = data?.code || `HTTP${response.status}`;
      const errorMessage =
        data?.message ||
        getErrorMessage(errorCode) ||
        "요청 처리 중 오류가 발생했습니다.";

      throw new ApiError(errorMessage, errorCode, data);
    }

    return data;
  } catch (error) {
    clearTimeout(id);
    console.error("API Request Error:", error);
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
  post: <T>(url: string, body?: any, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(url: string, body?: any, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "DELETE" }),
};
