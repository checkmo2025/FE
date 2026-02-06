'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

interface ChatInputProps {
  onSend: (text: string) => boolean | void;
  placeholder?: string;
  buttonIconSrc?: string;
  className?: string;
  initialValue?: string;
}

export default function LongtermChatInput({
  onSend,
  placeholder,
  buttonIconSrc = '/Send.svg',
  className = '',
  initialValue,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  };

  const handleSend = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const text = ta.value.trim();
    if (!text) return;

    const ok = onSend(text);
    if (ok === false) return;

    ta.value = '';
    adjustHeight();
  };

  useEffect(() => {
    if (initialValue === undefined) return;
    const ta = textareaRef.current;
    if (!ta) return;
    ta.value = initialValue;
    adjustHeight();
  }, [initialValue]);

  return (
    <div className={`min-w-0 flex-1 flex items-center ${className}`}>
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder={placeholder}
        onInput={adjustHeight}
        className="
          min-w-0 flex-1
          bg-transparent outline-none resize-none
          overflow-hidden
          border-b border-Subbrown-4
          py-2
          [font-feature-settings:'case'_on]
          d:body_1_2
          t:body_2_3
          body_2_3
          text-Gray-6 placeholder:text-Gray-4
        "
      />

      {/* 글 뒤 20px + 전송 */}
      <button
        type="button"
        onClick={handleSend}
        className="shrink-0 ml-5 w-6 h-6 relative"
        aria-label="발제 전송"
      >
        <Image src={buttonIconSrc} alt="" fill className="object-contain" />
      </button>
    </div>
  );
}
