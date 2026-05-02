import React from "react";
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
};

export default function FollowItem({ user, onToggleFollow, onDelete }: FollowItemProps) {
    const isDeleted = user.isDeleted ?? false;

    const handleDelete = () => {
        if (onDelete && !isDeleted) {
            onDelete(user.nickname);
        }
    };

    return (
        <div className="flex w-full max-w-[1040px] p-[20px] justify-between items-center rounded-[8px] border border-Subbrown-4 bg-White">
            <Link href={`/profile/${user.nickname}`} className="flex items-center gap-[12px] cursor-pointer">
                <div className="flex w-[40px] h-[40px] justify-center items-center shrink-0 rounded-full overflow-hidden relative">
                    <Image
                        src={isValidUrl(user.profileImageUrl) ? user.profileImageUrl : DEFAULT_PROFILE_IMAGE}
                        alt={user.nickname}
                        fill
                        className="object-cover"
                    />
                </div>
                <span className="text-Gray-7 subhead_4_1">{user.nickname}</span>
            </Link>

            {onDelete ? (
                !isDeleted && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="flex px-[17px] py-[8px] justify-center items-center gap-[10px] rounded-[8px] transition-colors bg-Red text-White"
                    >
                        <span className="font-sans text-[12px] font-semibold leading-[100%] tracking-[-0.012px]">
                            삭제
                        </span>
                    </button>
                )
            ) : (
                <button
                    type="button"
                    onClick={() => onToggleFollow(user.id, user.isFollowing)}
                    className={`flex px-[17px] py-[8px] justify-center items-center gap-[10px] rounded-[8px] transition-colors ${user.isFollowing
                        ? "bg-Subbrown-4 text-primary-3"
                        : "bg-primary-2 text-White"
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
