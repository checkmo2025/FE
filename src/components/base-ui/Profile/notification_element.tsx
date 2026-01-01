import React from "react";

type NotificationType = "like" | "comment";

type NotificationElementProps = {
  nickname: string;
  type: NotificationType;
  commentContent?: string;
  timeLabel: string; // "지금", "2분 전"
  isLatest?: boolean;
};

export default function NotificationElement({
  nickname,
  type,
  commentContent,
  timeLabel,
  isLatest = false,
}: NotificationElementProps) {
  const textColorClass = isLatest
    ? "text-[color:var(--Gray_7,#2C2C2C)]"
    : "text-[color:var(--Gray_3,#BBB)]";

  const message =
    type === "like"
      ? `${nickname}님이 좋아요를 눌렀습니다.`
      : `${nickname}님이 댓글을 남겼습니다.${commentContent ? `: ${commentContent}` : ""}`;

  return (
    <div className="flex w-[364px] px-[16px] py-[20px] justify-between items-center border-b border-b-[color:var(--Subbrown_4,#EAE5E2)] bg-[color:var(--White,#FFF)]">
      {/* left */}
      <div className="flex items-center gap-[12px] min-w-0">
        
        {isLatest ? (
          <span className="w-[12px] h-[12px] rounded-full bg-red-500 shrink-0" />
        ) : (<span className="w-[12px] h-[12px] shrink-0" />)}

        <p className={`${textColorClass} Body_1_2 truncate`}>{message}</p>
      </div>

      {/* right */}
      <span className="shrink-0 text-[color:var(--Gray_3,#BBB)] Body_1_2">
        {timeLabel}
      </span>
    </div>
  );
}
