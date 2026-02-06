"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type GroupAdminMenuProps = {
  groupId: number;
};

export default function GroupAdminMenu({ groupId }: GroupAdminMenuProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMembersClick = () => {
    router.push(`/groups/${groupId}/admin/members`);
    setMenuOpen(false);
  };

  const handleApplicantClick = () => {
    router.push(`/groups/${groupId}/admin/applicant`);
    setMenuOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <span className="body_1_3 text-Gray-5">모임 관리하기</span>
        <Image
          src="/Setting.svg"
          alt="설정"
          width={24}
          height={24}
          className="object-contain"
        />
      </button>

      {menuOpen && (
        <div
          className="
            absolute right-0 top-full mt-2
            w-34 h-[80px]
            rounded-lg
            border border-Subbrown-4
            bg-White
            shadow-md
            z-10
            flex flex-col
          "
        >
          <button
            type="button"
            onClick={handleApplicantClick}
            className="
              flex-1 w-full
              flex items-center justify-center
              body_1_2 text-Gray-4
              hover:text-Gray-7
              cursor-pointer
            "
          >
            모임 가입 신청 관리
          </button>

          <div className="mx-3 border-b border-Subbrown-4" />

          <button
            type="button"
            onClick={handleMembersClick}
            className="
              flex-1 w-full
              flex items-center justify-center
              body_1_2 text-Gray-4
              hover:text-Gray-7
              cursor-pointer
            "
          >
            모임 회원 관리
          </button>
        </div>
      )}
    </div>
  );
} 