import Image from "next/image";
import { useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

type CommentMenuProps = {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  hasReplyAction: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canReport: boolean;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
};

export default function CommentMenu({
  open,
  onToggle,
  onClose,
  hasReplyAction,
  canEdit,
  canDelete,
  canReport,
  onReply,
  onEdit,
  onDelete,
  onReport,
}: CommentMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, onClose);

  const hasManageAction = canEdit || canDelete;

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        type="button"
        onClick={onToggle}
        className="p-1 cursor-pointer"
      >
        <Image src="/menu_dots.svg" alt="메뉴" width={20} height={20} />
      </button>

      {/* 드롭다운 메뉴 */}
      {open && (
        <div className="absolute right-0 top-full mt-1 w-[137px] rounded-lg bg-White shadow-lg z-10 overflow-hidden">
          
          {/* 답글달기 - 상위 댓글일 때만 표시 */}
          {hasReplyAction && (
            <>
              <button
                type="button"
                onClick={() => {
                  onReply();
                  onClose();
                }}
                className="flex w-full h-[44px] items-center justify-center gap-2 Body_1_2 text-Gray-4 hover:bg-Gray-1 cursor-pointer"
              >
                <Image src="/reply2.svg" alt="답글" width={24} height={24} />
                답글달기
              </button>
              {(hasManageAction || canReport) && (
                <div className="mx-2 border-b border-Subbrown-4" />
              )}
            </>
          )}

          {/* 내 댓글일 경우 삭제/수정, 아닐 경우 신고 */}
          {hasManageAction ? (
            <>
              {canDelete && (
                <button
                  type="button"
                  onClick={() => {
                    onDelete();
                    onClose();
                  }}
                  className="flex w-full h-[44px] items-center justify-center gap-2 Body_1_2 text-Gray-4 hover:bg-Gray-1 cursor-pointer"
                >
                  <Image
                    src="/delete.svg"
                    alt="삭제"
                    width={24}
                    height={24}
                  />
                  삭제하기
                </button>
              )}

              {canEdit && canDelete && (
                <div className="mx-2 border-b border-Subbrown-4" />
              )}

              {canEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onEdit();
                    onClose();
                  }}
                  className="flex w-full h-[44px] items-center justify-center gap-2 Body_1_2 text-Gray-4 hover:bg-Gray-1 cursor-pointer"
                >
                  <Image src="/edit2.svg" alt="수정" width={24} height={24} />
                  수정하기
                </button>
              )}
            </>
          ) : (
            canReport && (
              <button
                type="button"
                onClick={() => {
                  onReport();
                  onClose();
                }}
                className="flex w-full h-[44px] items-center justify-center gap-2 Body_1_2 text-Gray-4 hover:bg-Gray-1 cursor-pointer"
              >
                <Image src="/report.svg" alt="신고" width={24} height={24} />
                신고하기
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
