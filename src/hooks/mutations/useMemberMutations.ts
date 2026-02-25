import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memberService } from "@/services/memberService";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

interface UpdateProfilePayload {
    description: string;
    categories: string[];
    profileImageFile: File | null;
    currentProfileImageUrl: string | null;
}

export const useUpdateProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateProfilePayload) => {
            let imgUrl = payload.currentProfileImageUrl || undefined;

            // 1. Image Upload (If file is selected)
            if (payload.profileImageFile) {
                // Assume default mime if not present
                const contentType = payload.profileImageFile.type || "image/jpeg";
                // Get Pre-signed URL
                const presignedRes = await authService.getPresignedUrl("PROFILE", payload.profileImageFile.name, contentType);

                // Upload to S3
                await authService.uploadToS3(presignedRes.result!.presignedUrl, payload.profileImageFile);

                // Use the returned image URL for update
                imgUrl = presignedRes.result!.imageUrl;
            } else if (payload.currentProfileImageUrl && payload.currentProfileImageUrl.startsWith("blob:")) {
                // In case blob URL leaked without file, though shouldn't happen, clear it
                imgUrl = undefined;
            }

            // 2. Update Profile Information
            await memberService.updateProfile({
                description: payload.description,
                categories: payload.categories,
                imgUrl: imgUrl || "", // Backend might expect empty string for default
            });
        },
        onSuccess: () => {
            // Refresh the page to reload user data into auth store properly based on top level layout
            window.location.reload();
            queryClient.invalidateQueries({ queryKey: ["member", "me"] });
        },
        onError: (error: any) => {
            console.error("Failed to update profile:", error);
        },
    });
};
