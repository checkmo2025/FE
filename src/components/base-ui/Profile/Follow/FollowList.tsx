import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import FollowItem, { FollowUser } from "./Follow/FollowItem";

type FollowListProps = {
    activeTab: "follower" | "following";
    onTabChange: (tab: "follower" | "following") => void;
    followerCount: number;
    followingCount: number;
    users: FollowUser[];
    onToggleFollow: (id: string | number, isFollowing: boolean) => void;
    onDelete?: (nickname: string) => void;
    hasMore?: boolean;
    onLoadMore?: () => void;
    isFetching?: boolean;
};

export default function FollowList({
    activeTab,
    onTabChange,
    followerCount,
    followingCount,
    users,
    onToggleFollow,
    onDelete,
    hasMore,
    onLoadMore,
    isFetching,
}: FollowListProps) {
    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: "200px",
    });

    useEffect(() => {
        if (inView && hasMore && !isFetching && onLoadMore) {
            onLoadMore();
        }
    }, [inView, hasMore, isFetching, onLoadMore]);

    return (
        <div className="flex flex-col w-full max-w-[1040px] px-4 md:px-0 mx-auto gap-[40px] mt-[24px]">
            {/* Menu Tabs */}
            <div className="flex px-[37px] items-center self-stretch border-b-2 border-Gray-2 w-full">
                {/* Followers Tab */}
                <button
                    onClick={() => onTabChange("follower")}
                    className={`flex p-[10px] justify-center items-center gap-[10px] flex-1 border-b-2 transition-colors cursor-pointer -mb-[2px] ${activeTab === "follower"
                        ? "border-primary-3 text-primary-3"
                        : "border-transparent text-Gray-3"
                        }`}
                >
                    <span className="font-sans text-[20px] font-semibold leading-[135%] tracking-[-0.02px]">
                        구독자 {followerCount}
                    </span>
                </button>

                {/* Following Tab */}
                <button
                    onClick={() => onTabChange("following")}
                    className={`flex p-[10px] justify-center items-center gap-[10px] flex-1 border-b-2 transition-colors cursor-pointer -mb-[2px] ${activeTab === "following"
                        ? "border-primary-3 text-primary-3"
                        : "border-transparent text-Gray-3"
                        }`}
                >
                    <span className="font-sans text-[20px] font-semibold leading-[135%] tracking-[-0.02px]">
                        구독중 {followingCount}
                    </span>
                </button>
            </div>

            {/* List */}
            <div className="flex flex-col items-start gap-[8px] w-full">
                {users.length > 0 ? (
                    users.map((user) => (
                        <FollowItem
                            key={user.id}
                            user={user}
                            onToggleFollow={onToggleFollow}
                            onDelete={activeTab === "follower" ? onDelete : undefined}
                        />
                    ))
                ) : (
                    <div className="flex w-full min-h-[200px] justify-center items-center text-Gray-4 body_1_2">
                        표시할 유저가 없습니다.
                    </div>
                )}

                {/* Infinite Scroll Trigger */}
                {hasMore && (
                    <div ref={ref} className="w-full h-[20px] flex-shrink-0" />
                )}
                {isFetching && (
                    <div className="w-full py-4 flex justify-center items-center">
                        <span className="text-Gray-4 text-sm">로딩 중...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
