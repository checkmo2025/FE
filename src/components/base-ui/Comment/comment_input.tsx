"use client";

import { useState } from "react";

//댓글 입력창 컴포넌트
type CommentInputProps = {
  onSubmit: (content: string) => void;
  placeholder?: string;
};

export default function CommentInput({
  onSubmit,
  placeholder = "댓글 내용",
}: CommentInputProps) {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content);
    setContent("");
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder={placeholder}
        className="flex-1 w-[240px] h-[36px] t:w-[850px] t:h-[56px] px-4 py-3 rounded-lg border border-Subbrown-4 bg-White Body_1_2 text-Gray-7 placeholder:text-Gray-3 outline-none"
      />
      <button
        type="button"
        onClick={handleSubmit}
        className="px-auto t:px-6 py-auto t:py-3 w-[60px] h-[36px] t:w-[128px] t:h-[56px] border border-Subbrown-3 text-primary-3 rounded-lg bg-Subbrown-4 subhead_4_1 cursor-pointer"
      >
        입력
      </button>
    </div>
  );
}
