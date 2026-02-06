'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

// 더미 데이터
const DUMMY_MEMBERS = [
  { id: 1, userId: 'hy_0716', name: '윤현일', email: 'yhi9839@naver.com', joinDate: '2000.00.00', role: 'member' },
  { id: 2, userId: 'hy_0716', name: '윤현일', email: 'yhi9839@naver.com', joinDate: '2000.00.00', role: 'member' },
  { id: 3, userId: 'hy_0716', name: '윤현일', email: 'yhi9839@naver.com', joinDate: '2000.00.00', role: 'member' },
  { id: 4, userId: 'hy_0716', name: '윤현일', email: 'yhi9839@naver.com', joinDate: '2000.00.00', role: 'member' },
  { id: 5, userId: 'hy_0716', name: '윤현일', email: 'yhi9839@naver.com', joinDate: '2000.00.00', role: 'member' },
  { id: 6, userId: 'hy_0716', name: '윤현일', email: 'yhi9839@naver.com', joinDate: '2000.00.00', role: 'member' },
  { id: 7, userId: 'hy_0716', name: '윤현일', email: 'yhi9839@naver.com', joinDate: '2000.00.00', role: 'member' },
  { id: 8, userId: 'hy_0716', name: '윤현일', email: 'yhi9839@naver.com', joinDate: '2000.00.00', role: 'member' },
  { id: 9, userId: 'hy_0716', name: '윤현일', email: 'yhi9839@naver.com', joinDate: '2000.00.00', role: 'member' },
  { id: 10, userId: 'hy_0716', name: '윤현일', email: 'yhi9839@naver.com', joinDate: '2000.00.00', role: 'member' },
];

type RoleType = 'admin' | 'member' | 'creator' | null;

type RoleEditDropdownProps = {
  isOpen: boolean;
  onSelectRole: (role: RoleType) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
};

function RoleEditDropdown({ isOpen, onSelectRole, buttonRef }: RoleEditDropdownProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.right - 136, // w-34 = 136px
      });
    }
  }, [isOpen, buttonRef]);

  if (!isOpen) return null;

  const roles = [
    { type: 'admin' as RoleType, label: '운영진 역할', icon: '/admin.svg' },
    { type: 'member' as RoleType, label: '회원 역할', icon: '/member.svg' },
    { type: 'creator' as RoleType, label: '개설자 역할', icon: '/leader.svg' },
    { type: null, label: '회원 탈퇴', icon: '/logout.svg' },
  ];

  return (
    <div
      className="fixed w-34 h-44 rounded-lg border border-Subbrown-4 bg-White shadow-md z-50 overflow-hidden"
      style={{ top: position.top, left: position.left }}
    >
      {roles.map((role, index) => (
        <div key={role.label}>
          {index > 0 && <div className="mx-3 border-b border-Subbrown-4" />}
          <button
            type="button"
            onClick={() => {
              onSelectRole(role.type);
            }}
            className="flex w-full h-11 items-center gap-3 px-4 body_1_2 text-Gray-4 hover:text-Gray-7 cursor-pointer"
          >
            <Image
              src={role.icon}
              alt={role.label}
              width={24}
              height={24}
              className="object-contain"
            />
            <span>{role.label}</span>
          </button>
        </div>
      ))}
    </div>
  );
}

export default function AdminMembersPage() {
  const params = useParams();
  const groupId = params.id as string;
  const [members, setMembers] = useState(DUMMY_MEMBERS);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(members.length / itemsPerPage);

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openMenuId === null) return;
      const menuRef = menuRefs.current[openMenuId];
      if (menuRef && !menuRef.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const handleRoleEdit = (memberId: number) => {
    setOpenMenuId(openMenuId === memberId ? null : memberId);
  };

  const handleSelectRole = (memberId: number, role: RoleType) => {
    if (role === null) {
      // 회원 탈퇴
      setMembers(members.filter((m) => m.id !== memberId));
    } else {
      // 역할 변경
      setMembers(
        members.map((m) =>
          m.id === memberId ? { ...m, role } : m
        )
      );
    }
    setOpenMenuId(null);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return '운영진';
      case 'creator':
        return '개설자';
      case 'member':
      default:
        return '회원';
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMembers = members.slice(startIndex, endIndex);

  return (
    <div className="w-full px-4">
      <div className="mx-auto w-full max-w-260 py-6">
        <div className="mb-2">
          <h1 className="subhead_1 t:subhead_3 text-Gray-7">모임 회원 관리</h1>
        </div>
        <div className="mb-6">
          <p className="body_1_3 text-Gray-4 whitespace-pre-line">
          개설자는 독서모임을 생성한 계정에게 최초 부여되며, 독서 모임 당 개설자 계정은 한개입니다.<br />개설자가 운영진 혹은 회원에게 개설자 역할을 부여 할 수 있으며, 이때 부여한 계정은 "운영진"역할로 변경됩니다.
          </p>
        </div>

        {/* 테이블 */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-200 d:min-w-0">
            <div className="flex items-center border-b border-Subbrown-3">
              <div className="w-45 d:w-45 px-4 py-3 shrink-0">
                <p className="body_1_2 text-Gray-4">ID</p>
              </div>
              <div className="w-45 d:w-45 px-4 py-3 shrink-0">
                <p className="body_1_2 text-Gray-4">이름</p>
              </div>
              <div className="w-56 d:w-56 px-4 py-3 shrink-0">
                <p className="body_1_2 text-Gray-4">이메일</p>
              </div>
              <div className="w-56 d:w-56 px-4 py-3 shrink-0">
                <p className="body_1_2 text-Gray-4">가입 일자</p>
              </div>
              <div className="w-28 d:w-28 px-4 py-3 shrink-0">
                <p className="body_1_2 text-Gray-4">역할</p>
              </div>
              <div className="w-28 d:w-28 px-4 py-3 shrink-0">
                <p className="body_1_2 text-Gray-4">역할 수정</p>
              </div>
            </div>

            {/* 테이블 바디 */}
            <div className="divide-y divide-Subbrown-4 border-b border-Subbrown-4">
              {currentMembers.map((member) => (
                <div key={member.id} className="flex items-center">
                  <div className="w-45 h-15 px-4 py-3 flex items-center gap-2 shrink-0">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0">
                      <Image
                        src="/profile2.svg"
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="24px"
                      />
                    </div>
                    <p className="body_1_2 text-Gray-7">{member.userId}</p>
                  </div>
                  <div className="w-45 d:w-45 px-4 py-3 shrink-0">
                    <p className="body_1_2 text-Gray-7">{member.name}</p>
                  </div>
                  <div className="w-56 d:w-56 px-4 py-3 shrink-0">
                    <p className="body_1_2 text-Gray-7">{member.email}</p>
                  </div>
                  <div className="w-56 d:w-56 px-4 py-3 shrink-0">
                    <p className="body_1_2 text-Gray-7">{member.joinDate}</p>
                  </div>
                  <div className="w-28 d:w-28 px-4 py-3 shrink-0">
                    <p className="body_1_2 text-Gray-7">{getRoleLabel(member.role)}</p>
                  </div>
                  <div className="w-28 d:w-28 px-4 py-3 shrink-0 relative" ref={(el) => { menuRefs.current[member.id] = el; }}>
                    <button
                      type="button"
                      ref={(el) => { buttonRefs.current[member.id] = el; }}
                      onClick={() => handleRoleEdit(member.id)}
                      className="body_1_2 text-Gray-7 underline underline-offset-2 cursor-pointer"
                    >
                      역할 수정
                    </button>
                    <RoleEditDropdown
                      isOpen={openMenuId === member.id}
                      onSelectRole={(role) => handleSelectRole(member.id, role)}
                      buttonRef={{ current: buttonRefs.current[member.id] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Image
              src="/ArrowLeft2.svg"
              alt="이전"
              width={16}
              height={16}
              className="object-contain"
            />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 body_1_2 ${
                currentPage === page
                  ? 'text-Gray-7 font-semibold'
                  : 'text-Gray-4 hover:text-Gray-7'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Image
              src="/ArrowRight2.svg"
              alt="다음"
              width={16}
              height={16}
              className="object-contain"
            />
          </button>
        </div>
      </div>

    </div>
  );
}
