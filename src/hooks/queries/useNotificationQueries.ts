import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";

export const notificationKeys = {
    all: ["notifications"] as const,
    settings: () => [...notificationKeys.all, "settings"] as const,
    infiniteList: () => [...notificationKeys.all, "infiniteList"] as const,
    preview: (size?: number) => [...notificationKeys.all, "preview", size] as const,
};

export const useNotificationSettingsQuery = () => {
    return useQuery({
        queryKey: notificationKeys.settings(),
        queryFn: () => notificationService.getSettings(),
    });
};

export const useInfiniteNotificationsQuery = () => {
    return useInfiniteQuery({
        queryKey: notificationKeys.infiniteList(),
        queryFn: ({ pageParam }) => notificationService.getNotifications(pageParam ?? undefined),
        initialPageParam: null as number | null,
        getNextPageParam: (lastPage) => {
            if (!lastPage || !lastPage.hasNext) return undefined;
            return lastPage.nextCursor;
        },
    });
};

export const useNotificationPreviewQuery = (size?: number) => {
    return useQuery({
        queryKey: notificationKeys.preview(size),
        queryFn: () => notificationService.getNotificationPreview(size),
    });
};
