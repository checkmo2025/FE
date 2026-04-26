type CommentEditFormProps = {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function CommentEditForm({
  value,
  onChange,
  onSave,
  onCancel,
}: CommentEditFormProps) {
  return (
    <div className="flex flex-col gap-2 mt-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[80px] px-4 py-3 rounded-lg border border-Subbrown-4 bg-White Body_1_2 text-Gray-7 outline-none focus:border-primary-3 resize-none whitespace-pre-wrap"
        autoFocus
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-Gray-2 text-Gray-6 subhead_4_1"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-2 rounded-lg bg-primary-3 text-White subhead_4_1"
        >
          저장
        </button>
      </div>
    </div>
  );
}
