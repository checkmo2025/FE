import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";

export const notificationKeys = {
    all: ["notifications"] as const,
    settings: () => [...notificationKeys.all, "settings"] as const,
};

export const useNotificationSettingsQuery = () => {
    return useQuery({
        queryKey: notificationKeys.settings(),
        queryFn: () => notificationService.getSettings(),
    });
};
