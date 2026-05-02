"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { isValidUrl } from "@/utils/url";
import ProfileBreadcrumb from "@/components/base-ui/Profile/OtherUser/ProfileBreadcrumb";
import FollowList from "@/components/base-ui/Profile/Follow/FollowList";
import { FollowUser } from "@/components/base-ui/Profile/Follow/FollowItem";
import { useOtherProfileQuery, useFollowerListQuery, useFollowingListQuery } from "@/hooks/queries/useMemberQueries";
import { useToggleFollowMutation } from "@/hooks/mutations/useMemberMutations";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/images";

function OtherUserFollowsContent() {
    const router = useRouter();
    const params = useParams();
    const nickname = params?.nickname as string;
    const decodedNickname = decodeURIComponent(nickname || "");
    const searchParams = useSearchParams();
    const initialTab = (searchParams?.get("tab") as "follower" | "following") || "follower";
    const [activeTab, setActiveTab] = useState<"follower" | "following">(initialTab);

    const { data: profileData, isLoading: isProfileLoading } = useOtherProfileQuery(decodedNickname);

    const {
        data: followerData,
        fetchNextPage: fetchNextFollower,
        hasNextPage: hasNextFollower,
        isFetchingNextPage: isFetchingNextFollower,
        isLoading: isFollowerLoading
    } = useFollowerListQuery(decodedNickname, activeTab === "follower");

    const {
        data: followingData,
        fetchNextPage: fetchNextFollowing,
        hasNextPage: hasNextFollowing,
        isFetchingNextPage: isFetchingNextFollowing,
        isLoading: isFollowingLoading
    } = useFollowingListQuery(decodedNickname, activeTab === "following");

    const { mutate: toggleFollow } = useToggleFollowMutation();

    // URL Query Params 갱신
    useEffect(() => {
        router.replace(`?tab=${activeTab}`, { scroll: false });
    }, [activeTab, router]);

    if (isProfileLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-1"></div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="flex justify-center items-center h-screen text-Gray-4">
                사용자를 찾을 수 없습니다.
            </div>
        );
    }

    const currentData = activeTab === "follower" ? followerData : followingData;

    // API 응답 데이터를 FollowUser 타입으로 매핑
    const users: FollowUser[] = currentData?.pages.flatMap(page => page.followList).map(userDTO => ({
        id: userDTO.nickname,
        nickname: userDTO.nickname,
        profileImageUrl: userDTO.profileImageUrl,
        isFollowing: userDTO.following,
    })) || [];

    const handleToggleFollow = (id: string | number, currentIsFollowing: boolean) => {
        toggleFollow({ nickname: String(id), isFollowing: currentIsFollowing });
    };

    const hasMore = activeTab === "follower" ? hasNextFollower : hasNextFollowing;
    const isFetching = activeTab === "follower" ? isFetchingNextFollower || isFollowerLoading : isFetchingNextFollowing || isFollowingLoading;
    const handleLoadMore = () => {
        if (activeTab === "follower") fetchNextFollower();
        else fetchNextFollowing();
    };

    return (
        <div className="flex flex-col items-center gap-[10px] md:gap-[24px] w-full min-h-screen bg-[#F9F7F6] pb-[100px]">
            <ProfileBreadcrumb nickname={decodedNickname} />

            <div className="flex flex-col items-center w-full max-w-[1440px] px-4 md:px-0 mt-[12px] md:mt-[56px] gap-[24px]">
                {/* Profile Image & Nickname Area */}
                <div className="flex flex-col items-center gap-[16px] w-[138px]">
                    <div className="flex justify-center items-center w-[138px] h-[138px] rounded-full overflow-hidden relative shrink-0">
                        <Image
                            src={isValidUrl(profileData.profileImageUrl) ? profileData.profileImageUrl : DEFAULT_PROFILE_IMAGE}
                            alt={profileData.nickname}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="self-stretch text-center text-Gray-7 font-sans text-[24px] font-semibold leading-[135%] tracking-[-0.024px]">
                        {profileData.nickname}
                    </span>
                </div>

                {/* Follow Tabs and List */}
                <FollowList
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    followerCount={profileData.followerCount}
                    followingCount={profileData.followingCount}
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

export default function OtherUserFollowsPage() {
    return (
        <Suspense fallback={
            <div className="flex w-full min-h-screen justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-2"></div>
            </div>
        }>
            <OtherUserFollowsContent />
        </Suspense>
    );
}
