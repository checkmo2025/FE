import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { isValidUrl } from "@/utils/url";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/images";

export type FollowUser = {
    id: string | number;
    nickname: string;
    profileImageUrl?: string;
    isFollowing: boolean;
    isDeleted?: boolean;
};

type FollowItemProps = {
    user: FollowUser;
    onToggleFollow: (id: string | number, isFollowing: boolean) => void;
    onDelete?: (nickname: string) => void;
    /** 닉네임 옆 인라인 배지 (예: 운영진) */
    badge?: React.ReactNode;
    /** 닉네임 아래 보조 라벨 (예: 개설자 / 회원) */
    subLabel?: string;
    /** 구독 버튼 숨김 (예: 본인) */
    hideFollow?: boolean;
};

export default function FollowItem({ user, onToggleFollow, onDelete, badge, subLabel, hideFollow }: FollowItemProps) {
    const isDeleted = user.isDeleted ?? false;

    const isDeletingRef = useRef(false);

    const handleDelete = () => {
        if (!onDelete || isDeleted || isDeletingRef.current) return;
        isDeletingRef.current = true;
        onDelete(user.nickname);
    };

    return (
        <div className="flex w-full max-w-[1040px] p-[20px] justify-between items-center gap-[12px] rounded-[8px] border border-Subbrown-4 bg-White transition-colors hover:bg-Subbrown-5">
            <Link href={`/profile/${user.nickname}`} className="group flex items-center gap-[12px] cursor-pointer min-w-0">
                <div className="flex w-[40px] h-[40px] justify-center items-center shrink-0 rounded-full overflow-hidden relative">
                    <Image
                        src={isValidUrl(user.profileImageUrl) ? user.profileImageUrl : DEFAULT_PROFILE_IMAGE}
                        alt={user.nickname}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-[6px] min-w-0">
                        <span className="text-Gray-7 subhead_4_1 truncate group-hover:underline">{user.nickname}</span>
                        {badge}
                    </div>
                    {subLabel && (
                        <span className="block mt-[2px] body_2_3 text-Gray-4">{subLabel}</span>
                    )}
                </div>
            </Link>

            {onDelete && (
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleted}
                    className={`flex shrink-0 px-[17px] py-[8px] justify-center items-center gap-[10px] rounded-[8px] transition-colors ${isDeleted
                        ? "bg-Subbrown-4 text-primary-3 cursor-not-allowed opacity-50"
                        : "bg-Red text-White cursor-pointer hover:brightness-95"
                        }`}
                >
                    <span className="font-sans text-[12px] font-semibold leading-[100%] tracking-[-0.012px]">
                        {isDeleted ? "삭제됨" : "삭제"}
                    </span>
                </button>
            )}
            {!onDelete && !hideFollow && (
                <button
                    type="button"
                    onClick={() => onToggleFollow(user.id, user.isFollowing)}
                    className={`flex shrink-0 px-[17px] py-[8px] justify-center items-center gap-[10px] rounded-[8px] transition-colors cursor-pointer ${user.isFollowing
                        ? "bg-Subbrown-4 text-primary-3 hover:bg-Subbrown-3"
                        : "bg-primary-2 text-White hover:bg-primary-1"
                        }`}
                >
                    <span className="font-sans text-[12px] font-semibold leading-[100%] tracking-[-0.012px]">
                        {user.isFollowing ? "구독중" : "구독"}
                    </span>
                </button>
            )}
        </div>
    );
}
