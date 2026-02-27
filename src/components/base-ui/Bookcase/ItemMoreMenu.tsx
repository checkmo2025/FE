"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  canManage: boolean;
  onReport: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

const ICON_REPORT = "/Danger_Circle.svg";
const ICON_EDIT = "/Edit.svg";  
const ICON_DELETE = "/Delete_2.svg";

export default function ItemMoreMenu({ canManage, onReport, onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const handle = (fn: () => void) => {
    fn();
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative w-6 h-6 shrink-0 hover:brightness-70 cursor-pointer mt-2"
        aria-label="더보기"
      >
        <Image src="/ant-design_more-outlined.svg" alt="" fill className="object-contain" />
      </button>

      {open && (
        <div
          className="
            absolute right-0 top-full mt-2
            w-34
            rounded-lg
            border border-Subbrown-4
            bg-White
            shadow-md
            z-20
            flex flex-col
            overflow-hidden
          "
        >
          <button
            type="button"
            onClick={() => handle(onReport)}
            className="h-[44px] w-[137px] flex items-center gap-[10px] justify-center px-5 py-[10px] body_1_2 text-Gray-4 hover:text-Gray-7 cursor-pointer"
          >
            <Image src={ICON_REPORT} alt="" width={24} height={24} className="object-contain shrink-0" />
            <span>신고하기</span>
          </button>

          {canManage && (
            <>
              <div className="mx-3 border-b border-Subbrown-4" />

              <button
                type="button"
                onClick={() => onEdit && handle(onEdit)}
                className="h-[44px] w-[137px] flex items-center gap-[10px] justify-center px-5 py-[10px] body_1_2 text-Gray-4 hover:text-Gray-7 cursor-pointer"
              >
                <Image src={ICON_EDIT} alt=""  width={24} height={24} className="object-contain shrink-0" />
                <span>수정하기</span>
              </button>

              <div className="mx-3 border-b border-Subbrown-4" />

              <button
                type="button"
                onClick={() => onDelete && handle(onDelete)}
                className="h-[44px] w-[137px] flex items-center gap-[10px] justify-center px-5 py-[10px] body_1_2 text-Gray-4 hover:text-Gray-7 cursor-pointer"
              >
                <Image src={ICON_DELETE} alt=""  width={24} height={24} className="object-contain shrink-0" />
                <span>삭제하기</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}