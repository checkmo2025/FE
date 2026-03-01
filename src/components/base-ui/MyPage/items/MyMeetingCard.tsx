"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MyClubInfo } from "@/types/club";
import { useLeaveClubMutation } from "@/hooks/mutations/useClubMutations";
import ConfirmModal from "@/components/common/ConfirmModal";

interface MyMeetingCardProps {
  club: MyClubInfo;
}

const MyMeetingCard = ({ club }: MyMeetingCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { mutate: leaveClub } = useLeaveClubMutation();

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

  const handleLeaveClick = () => {
    setIsConfirmModalOpen(true);
    setMenuOpen(false);
  };

  const handleConfirmLeave = () => {
    leaveClub(club.clubId);
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="flex w-full px-[18px] py-[12px] md:p-[20px] justify-between items-center rounded-[8px] bg-white border border-[#EAE5E2] gap-[12px]">
      <span className="text-[#5C5C5C] font-sans text-[16px] md:text-[24px] font-medium md:font-semibold leading-[135%] tracking-[-0.024px] truncate flex-1">
        {club.clubName}
      </span>

      <div className="relative shrink-0" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center justify-center shrink-0 cursor-pointer"
        >
          <Image
            src="/ant-design_more-outlined.svg"
            alt="more"
            width={24}
            height={24}
            className="shrink-0 w-[18px] h-[18px] md:w-[24px] md:h-[24px]"
          />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-34 rounded-lg bg-White z-10 px-2 shadow-md border border-Subbrown-4">
            <button
              type="button"
              onClick={handleLeaveClick}
              className="flex w-full items-center gap-2 px-4 py-3 body_1_2 text-Gray-4 hover:text-Gray-7 cursor-pointer"
            >
              <Image src="/report.svg" alt="탈퇴" width={20} height={20} />
              탈퇴하기
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message={`'${club.clubName}' 모임에서\n탈퇴하시겠습니까?`}
        onConfirm={handleConfirmLeave}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
};

export default MyMeetingCard;

