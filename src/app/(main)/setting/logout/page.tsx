"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";

export default function LogoutPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => {
        const performLogout = async () => {
            await authService.logout();
            queryClient.clear();
            router.refresh();
            router.push("/");
        };

        performLogout();
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-Gray-7"></div>
        </div>
    );
}
