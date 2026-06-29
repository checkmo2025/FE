import { INPUT_LIMITS } from "@/constants/inputLimits";
import { clampTextToLimit, isTextOverLimit } from "@/utils/inputLimit";

type CommentEditFormProps = {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  maxLength?: number;
  overLimitMessage?: string;
};

export default function CommentEditForm({
  value,
  onChange,
  onSave,
  onCancel,
  maxLength = INPUT_LIMITS.BOOK_STORY_COMMENT,
  overLimitMessage = `댓글은 ${INPUT_LIMITS.BOOK_STORY_COMMENT}자 이하여야 합니다.`,
}: CommentEditFormProps) {
  const handleSave = () => {
    if (isTextOverLimit(value, maxLength, overLimitMessage)) return;
    onSave();
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <textarea
        value={value}
        onChange={(e) => onChange(clampTextToLimit(e.target.value, maxLength, overLimitMessage))}
        className="w-full min-h-[80px] px-4 py-3 rounded-lg border border-Subbrown-4 bg-White Body_1_2 text-Gray-7 outline-none focus:border-primary-3 resize-none whitespace-pre-wrap"
        autoFocus
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-Gray-2 text-Gray-6 subhead_4_1 cursor-pointer"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-primary-3 text-White subhead_4_1 cursor-pointer"
        >
          저장
        </button>
      </div>
    </div>
  );
}
