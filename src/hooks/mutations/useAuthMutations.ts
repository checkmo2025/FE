import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { toast } from "react-hot-toast";

export const useSendTempPasswordMutation = () => {
    return useMutation({
        mutationFn: async (email: string) => {
            const response = await authService.sendTempPassword(email);
            if (!response.isSuccess) {
                // 백엔드에서 내려주는 커스텀 에러 처리
                throw new Error(response.message || "해당 이메일로 가입된 회원을 찾을 수 없습니다.");
            }
            return response.result!;
        },
        onSuccess: () => {
            toast.success("임시 비밀번호가 이메일로 전송되었습니다.");
        },
        onError: (error: any) => {
            console.error("Failed to send temp password:", error);
            const errorMessage = error.response?.data?.message || error.message || "해당 이메일로 가입된 회원을 찾을 수 없습니다.";
            toast.error(errorMessage);
        },
    });
};

export const useVerifyEmailMutation = () => {
    return useMutation({
        mutationFn: async ({ email, type = "SIGN_UP" }: { email: string; type?: string }) => {
            const response = await authService.verifyEmail(email, type);
            if (!response.isSuccess) {
                throw new Error(response.message || "인증번호 발송에 실패했습니다.");
            }
            return response;
        },
        onSuccess: () => {
            toast.success("인증번호가 발송되었습니다.");
        },
        onError: (error: any) => {
            console.error("Failed to send verification email:", error);
            const errorMessage = error.response?.data?.message || error.message || "인증번호 발송 로직 중 에러가 발생했습니다.";
            toast.error(errorMessage);
        },
    });
};
