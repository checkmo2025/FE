"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import { INPUT_LIMITS } from "@/constants/inputLimits";
import { clampTextToLimit, isTextOverLimit } from "@/utils/inputLimit";
import type { ImageUploadType } from "@/lib/api/endpoints/Image";
import { useImageAttachments } from "@/hooks/useImageAttachments";
import ImageAttachmentPicker from "@/components/common/ImageAttachmentPicker";

//댓글 입력창 컴포넌트
type CommentInputProps = {
  onSubmit: (content: string, imageUrls: string[]) => void | boolean | Promise<void | boolean>;
  placeholder?: string;
  maxLength?: number;
  overLimitMessage?: string;
  imageUploadType?: ImageUploadType;
  imageLimit?: number;
  compactImages?: boolean;
  beforeSubmit?: () => boolean;
};

export default function CommentInput({
  onSubmit,
  placeholder = "댓글 내용",
  maxLength = INPUT_LIMITS.BOOK_STORY_COMMENT,
  overLimitMessage = `댓글은 ${INPUT_LIMITS.BOOK_STORY_COMMENT}자 이하여야 합니다.`,
  imageUploadType,
  imageLimit = INPUT_LIMITS.BOOK_STORY_COMMENT_IMAGE_COUNT,
  compactImages = true,
  beforeSubmit,
}: CommentInputProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const attachments = useImageAttachments([], imageLimit);
  useUnsavedChangesGuard({
    isDirty: Boolean(content.trim() || attachments.isDirty),
    variant: "create",
    title: "작성 중인 댓글이 있어요",
    description: "이 화면을 나가면 입력한 댓글이 저장되지 않습니다.",
  });

  const handleSubmit = async () => {
    if (!content.trim()) return;
    if (isTextOverLimit(content, maxLength, overLimitMessage)) return;
    if (beforeSubmit && !beforeSubmit()) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const imageUrls = imageUploadType
        ? await attachments.resolveUrls(imageUploadType)
        : [];
      const result = await onSubmit(content, imageUrls);
      if (result === false) return;
      setContent("");
      attachments.reset([]);
    } catch {
      toast.error("이미지 업로드에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-3 w-full">
        <input
          type="text"
          data-comment-input="true"
          value={content}
          disabled={isSubmitting}
          onChange={(e) => setContent(clampTextToLimit(e.target.value, maxLength, overLimitMessage))}
          onKeyDown={(e) => {
            if (e.key === "Enter") void handleSubmit();
          }}
          placeholder={placeholder}
          className="flex-1 w-[240px] h-[36px] t:w-[850px] t:h-[56px] px-4 py-3 rounded-lg border border-Subbrown-4 bg-White body_1_2 text-Gray-7 placeholder:text-Gray-3 outline-none"
        />
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={isSubmitting}
          className="px-auto t:px-6 py-auto t:py-3 w-[60px] h-[36px] t:w-[128px] t:h-[56px] border border-Subbrown-3 text-primary-3 rounded-lg bg-Subbrown-4 subhead_4_1 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? "등록 중" : "입력"}
        </button>
      </div>
      {imageUploadType && (
        <ImageAttachmentPicker
          controller={attachments}
          disabled={isSubmitting}
          compact={compactImages}
        />
      )}
    </div>
  );
}
