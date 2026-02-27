"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  isDeleting?: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export default function BookshelfAdminMenu({ isDeleting = false, onEdit, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditClick = () => {
    onEdit();
    setMenuOpen(false);
  };

  const handleDeleteClick = () => {
    onDelete();
    setMenuOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        className="flex items-center gap-2 hover:brightness-50 cursor-pointer"
      >
        <span className="body_1_3 text-Gray-5">책장 관리하기</span>
        <Image src="/Setting.svg" alt="설정" width={24} height={24} className="object-contain" />
      </button>

      {menuOpen && (
        <div
          className="
            absolute right-0 top-full mt-2
            w-34
            rounded-lg
            border border-Subbrown-4
            bg-White
            shadow-md
            z-10
            flex flex-col
            overflow-hidden
          "
        >
          <button
            type="button"
            onClick={handleEditClick}
            className="
              h-[44px] w-full
              flex items-center justify-center
              body_1_2 text-Gray-4
              hover:text-Gray-7
              cursor-pointer
            "
          >
            책장 수정
          </button>

          <div className="mx-3 border-b border-Subbrown-4" />

          <button
            type="button"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="
              h-[44px] w-full
              flex items-center justify-center
              body_1_2 text-Gray-4
              hover:text-Gray-7
              cursor-pointer
              disabled:opacity-50
            "
          >
            {isDeleting ? "삭제중..." : "책장 삭제"}
          </button>
        </div>
      )}
    </div>
  );
}