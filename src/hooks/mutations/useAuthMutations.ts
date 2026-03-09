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
