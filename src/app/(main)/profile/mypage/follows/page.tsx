"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import MyPageBreadcrumb from "@/components/base-ui/MyPage/MyPageBreadcrumb";
import FollowList from "@/components/base-ui/Profile/FollowList";
import { FollowUser } from "@/components/base-ui/Profile/FollowItem";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useProfileQuery, useFollowerListQuery, useFollowingListQuery } from "@/hooks/queries/useMemberQueries";
import { DUMMY_USER_PROFILE } from "@/constants/mocks/mypage";

export default function FollowsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialTab = (searchParams?.get("tab") as "follower" | "following") || "follower";
    const [activeTab, setActiveTab] = useState<"follower" | "following">(initialTab);

    const { isInitialized, isLoggedIn } = useAuthGuard();
    const { data: profileData } = useProfileQuery();

    const {
        data: followerData,
        fetchNextPage: fetchNextFollower,
        hasNextPage: hasNextFollower,
        isFetchingNextPage: isFetchingNextFollower,
        isLoading: isFollowerLoading
    } = useFollowerListQuery(activeTab === "follower");

    const {
        data: followingData,
        fetchNextPage: fetchNextFollowing,
        hasNextPage: hasNextFollowing,
        isFetchingNextPage: isFetchingNextFollowing,
        isLoading: isFollowingLoading
    } = useFollowingListQuery(activeTab === "following");

    // URL Query Params 갱신
    useEffect(() => {
        router.replace(`?tab=${activeTab}`, { scroll: false });
    }, [activeTab, router]);

    if (!isInitialized || !isLoggedIn) {
        return null;
    }

    const user = {
        ...DUMMY_USER_PROFILE,
        name: profileData?.nickname || DUMMY_USER_PROFILE.name,
        profileImage: profileData?.profileImageUrl || DUMMY_USER_PROFILE.profileImage,
    };

    const currentData = activeTab === "follower" ? followerData : followingData;

    // API 응답 데이터를 FollowUser 타입으로 매핑
    const users: FollowUser[] = currentData?.pages.flatMap(page => page.followList).map(userDTO => ({
        id: userDTO.nickname,
        nickname: userDTO.nickname,
        profileImageUrl: userDTO.profileImageUrl,
        isFollowing: userDTO.following,
    })) || [];

    const handleToggleFollow = (id: string | number, currentIsFollowing: boolean) => {
        // TODO: Follow API Mutate 적용
        console.log("Toggle Follow for user ID:", id, "Current state:", currentIsFollowing);
    };

    const hasMore = activeTab === "follower" ? hasNextFollower : hasNextFollowing;
    const isFetching = activeTab === "follower" ? isFetchingNextFollower || isFollowerLoading : isFetchingNextFollowing || isFollowingLoading;
    const handleLoadMore = () => {
        if (activeTab === "follower") fetchNextFollower();
        else fetchNextFollowing();
    };

    return (
        <div className="flex flex-col items-center gap-[10px] md:gap-[24px] w-full min-h-screen bg-[#F9F7F6] pb-[100px]">
            <MyPageBreadcrumb />

            <div className="flex flex-col items-center w-full max-w-[1440px] px-4 md:px-0 mt-[12px] md:mt-[56px] gap-[24px]">
                {/* Profile Image & Nickname Area */}
                <div className="flex flex-col items-center gap-[16px] w-[138px]">
                    <div className="flex justify-center items-center w-[138px] h-[138px] rounded-full overflow-hidden relative shrink-0">
                        {user.profileImage ? (
                            <Image
                                src={user.profileImage}
                                alt={user.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-[#EAE5E2]" />
                        )}
                    </div>
                    <span className="self-stretch text-center text-Gray-7 font-sans text-[24px] font-semibold leading-[135%] tracking-[-0.024px]">
                        {user.name}
                    </span>
                </div>

                {/* Follow Tabs and List */}
                <FollowList
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    followerCount={user.subscribers || 0} // UserProfile에서 쓰는 값 임시 유지 (API 미제공)
                    followingCount={user.following || 0} // UserProfile에서 쓰는 값 임시 유지 (API 미제공)
                    users={users}
                    onToggleFollow={handleToggleFollow}
                    hasMore={hasMore}
                    onLoadMore={handleLoadMore}
                    isFetching={isFetching}
                />
            </div>
        </div>
    );
}
