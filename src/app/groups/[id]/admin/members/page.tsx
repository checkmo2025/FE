/* eslint-disable react-hooks/refs */
"use client";

import { useState, useRef, useEffect, useMemo, type RefObject } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

import { useInfiniteClubMembersQuery } from "@/hooks/queries/useClubMemberQueries";
import { useUpdateClubMemberStatusMutation } from "@/hooks/mutations/useClubMemberMutations";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/images";
import type {
  ClubMemberItem,
  ClubMemberStatus,
  UpdateClubMemberStatusRequest,
} from "@/types/groups/clubMembers";

const DEFAULT_PROFILE_IMG = DEFAULT_PROFILE_IMAGE;

function safeImageSrc(src: string | null | undefined) {
  if (!src) return DEFAULT_PROFILE_IMG;

  const s = src.trim();
  if (!s) return DEFAULT_PROFILE_IMG;

  // swagger 예시값/쓰레기값 방어
  if (s === "string") return DEFAULT_PROFILE_IMG;

  // next/image 허용: 절대 URL or "/" 로컬 경로만
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/")) {
    return s;
  }

  return DEFAULT_PROFILE_IMG;
}

// 날짜 포맷: 2026-02-26T... -> 2026.02.26
function formatDate(iso: string | null | undefined) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

// 역할 라벨 (UI는 기존 admin/member/creator 느낌 유지)
function getRoleLabelFromStatus(status: ClubMemberStatus) {
  switch (status) {
    case "OWNER":
      return "개설자";
    case "STAFF":
      return "운영진";
    case "MEMBER":
      return "회원";
    case "PENDING":
      return "대기";
    case "WITHDRAWN":
      return "탈퇴";
    case "KICKED":
      return "강퇴";
    default:
      return "회원";
  }
}

type RoleType = "admin" | "member" | "creator" | null;

type RoleEditDropdownProps = {
  isOpen: boolean;
  member: ClubMemberItem;
  onSelectRole: (role: RoleType) => void;
  onSelectPendingAction: (action: "APPROVE" | "REJECT") => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
};

function RoleEditDropdown({
  isOpen,
  member,
  onSelectRole,
  onSelectPendingAction,
  buttonRef,
}: RoleEditDropdownProps) {
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

  const status = member.clubMemberStatus;

  // PENDING: 승인/거절
  if (status === "PENDING") {
    const items = [
      { label: "가입 승인", icon: "/admin.svg", action: "APPROVE" as const },
      { label: "가입 거절", icon: "/Logout.svg", action: "REJECT" as const },
    ];

    return (
      <div
        className="fixed w-34 h-22 rounded-lg border border-Subbrown-4 bg-White shadow-md z-50 overflow-hidden"
        style={{ top: position.top, left: position.left }}
      >
        {items.map((it, idx) => (
          <div key={it.label}>
            {idx > 0 && <div className="mx-3 border-b border-Subbrown-4" />}
            <button
              type="button"
              onClick={() => onSelectPendingAction(it.action)}
              className="flex w-full h-11 items-center gap-3 px-4 body_1_2 text-Gray-4 hover:text-Gray-7 cursor-pointer"
            >
              <Image
                src={it.icon}
                alt={it.label}
                width={24}
                height={24}
                className="object-contain"
              />
              <span>{it.label}</span>
            </button>
          </div>
        ))}
      </div>
    );
  }

  // WITHDRAWN/KICKED: 변경 불가
  if (status === "WITHDRAWN" || status === "KICKED") {
    return (
      <div
        className="fixed w-34 h-11 rounded-lg border border-Subbrown-4 bg-White shadow-md z-50 overflow-hidden"
        style={{ top: position.top, left: position.left }}
      >
        <div className="flex w-full h-11 items-center gap-3 px-4 body_1_2 text-Gray-4">
          <Image
            src="/Logout.svg"
            alt="변경 불가"
            width={24}
            height={24}
            className="object-contain"
          />
          <span>변경 불가</span>
        </div>
      </div>
    );
  }

  // OWNER: 변경 메뉴 비활성
  if (status === "OWNER") {
    return (
      <div
        className="fixed w-34 h-11 rounded-lg border border-Subbrown-4 bg-White shadow-md z-50 overflow-hidden"
        style={{ top: position.top, left: position.left }}
      >
        <div className="flex w-full h-11 items-center gap-3 px-4 body_1_2 text-Gray-4">
          <Image
            src="/leader.svg"
            alt="개설자"
            width={24}
            height={24}
            className="object-contain"
          />
          <span>개설자</span>
        </div>
      </div>
    );
  }

  // MEMBER/STAFF 메뉴
  const roles = [
    { type: "admin" as RoleType, label: "운영진 역할", icon: "/admin.svg" },
    { type: "member" as RoleType, label: "회원 역할", icon: "/member.svg" },
    { type: "creator" as RoleType, label: "개설자 역할", icon: "/leader.svg" },
    { type: null, label: "회원 탈퇴", icon: "/Logout.svg" },
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
            onClick={() => onSelectRole(role.type)}
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
  const clubId = Number(groupId);

  const enabled = Number.isFinite(clubId) && clubId > 0;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteClubMembersQuery(clubId, "ALL", enabled);

  const members = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((p) => p.clubMembers);
  }, [data]);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  const { mutateAsync, isPending } = useUpdateClubMemberStatusMutation();

  // 페이지네이션 (기존 UI 유지)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadedPages = Math.max(1, Math.ceil(members.length / itemsPerPage));
  const totalPages = loadedPages + (hasNextPage ? 1 : 0);

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openMenuId === null) return;
      const menuRef = menuRefs.current[openMenuId];
      if (menuRef && !menuRef.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const handleRoleEdit = (memberId: number) => {
    setOpenMenuId(openMenuId === memberId ? null : memberId);
  };

  const runPatch = async (clubMemberId: number, body: UpdateClubMemberStatusRequest) => {
    try {
      await mutateAsync({ clubId, clubMemberId, body });
      toast.success("처리 완료");
      setOpenMenuId(null);
      await refetch(); // ALL 페이지 동기화
    } catch (e: any) {
      toast.error(e?.message ?? "요청 실패");
      setOpenMenuId(null);
    }
  };

  const handleSelectRole = (member: ClubMemberItem, role: RoleType) => {
    const status = member.clubMemberStatus;

    if (!(status === "MEMBER" || status === "STAFF")) {
      setOpenMenuId(null);
      return;
    }

    let body: UpdateClubMemberStatusRequest | null = null;

    if (role === "admin") body = { command: "CHANGE_ROLE", status: "STAFF" };
    else if (role === "member") body = { command: "CHANGE_ROLE", status: "MEMBER" };
    else if (role === "creator") body = { command: "TRANSFER_OWNER" };
    else if (role === null) body = { command: "KICK" };

    if (!body) {
      setOpenMenuId(null);
      return;
    }

    runPatch(member.clubMemberId, body);
  };

  const handleSelectPendingAction = (member: ClubMemberItem, action: "APPROVE" | "REJECT") => {
    if (member.clubMemberStatus !== "PENDING") {
      setOpenMenuId(null);
      return;
    }

    const body: UpdateClubMemberStatusRequest =
      action === "APPROVE" ? { command: "APPROVE" } : { command: "REJECT" };

    runPatch(member.clubMemberId, body);
  };

  const goToPage = async (page: number) => {
    if (page < 1) return;

    const isLoadMorePage = hasNextPage && page === totalPages;
    if (isLoadMorePage) {
      if (isFetchingNextPage) return;
      try {
        await fetchNextPage();
        setCurrentPage(page);
      } catch {}
      return;
    }

    const maxSelectable = loadedPages;
    if (page > maxSelectable) return;

    setCurrentPage(page);
  };

  useEffect(() => {
    const maxSelectable = loadedPages;
    if (!hasNextPage && currentPage > maxSelectable) setCurrentPage(maxSelectable);
  }, [loadedPages, hasNextPage, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMembers = members.slice(startIndex, endIndex);

  return (
    <div className="w-full px-4">
      <div className="mx-auto w-full max-w-260 py-6">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="subhead_1 t:subhead_3 text-Gray-7">모임 회원 관리</h1>

          <button
            type="button"
            onClick={() => refetch()}
            className="body_1_2 text-Gray-7 underline underline-offset-2"
          >
            새로고침
          </button>
        </div>

        <div className="mb-6">
          <p className="body_1_3 text-Gray-4 whitespace-pre-line">
            개설자는 독서모임을 생성한 계정에게 최초 부여되며, 독서 모임 당
            개설자 계정은 한개입니다.
            <br />
            개설자가 운영진 혹은 회원에게 개설자 역할을 부여 할 수 있으며, 이때
            부여한 계정은 운영진역할로 변경됩니다.
          </p>
        </div>

        {isLoading && <p className="body_1_2 text-Gray-4 px-1">불러오는 중...</p>}
        {isError && (
          <p className="body_1_2 text-Gray-4 px-1">목록을 불러오지 못했습니다.</p>
        )}

        <div className="w-full overflow-x-auto t:overflow-visible d:overflow-x-auto">
          <div className="min-w-fit t:min-w-0 d:min-w-200">
            <div className="flex items-center border-b border-Subbrown-3">
              <div className="hidden t:block t:w-35 d:w-45 t:px-3 d:px-4 py-3 shrink-0">
                <p className="body_1_2 text-Gray-4">ID</p>
              </div>
              <div className="w-20 t:w-16 d:w-45 px-3 t:px-3 d:px-4 py-3 shrink-0">
                <p className="body_1_2 text-Gray-4">이름</p>
              </div>
              <div className="hidden t:block t:w-39 d:w-56 t:px-3 d:px-4 py-3 shrink-0">
                <p className="body_1_2 text-Gray-4">이메일</p>
              </div>
              <div className="w-28 t:w-23 d:w-56 px-3 t:px-3 d:px-4 py-3 shrink-0">
                <p className="body_1_2 text-Gray-4">가입 일자</p>
              </div>
              <div className="w-16 t:w-20 d:w-28 px-3 t:px-3 d:px-4 py-3 shrink-0">
                <p className="body_1_2 text-Gray-4">역할</p>
              </div>
              <div className="w-20 t:w-25 d:w-28 px-3 t:px-3 d:px-4 py-3 shrink-0">
                <p className="body_1_2 text-Gray-4 t:hidden d:hidden">역할수정</p>
                <p className="body_1_2 text-Gray-4 hidden t:block">역할 수정</p>
              </div>
            </div>

            <div className="divide-y divide-Subbrown-4 border-b border-Subbrown-4 overflow-visible">
              {currentMembers.map((member) => {
                const nickname = member.detailInfo.nickname;
                const profileUrl = `/profile/${encodeURIComponent(nickname)}`;
                const joinDate = formatDate(member.joinedAt ?? member.appliedAt);

                return (
                  <div key={member.clubMemberId} className="flex items-center">
                    <div className="hidden t:flex t:w-35 d:w-45 h-15 t:px-3 d:px-4 py-3 items-center gap-2 shrink-0">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 bg-Gray-1">
                        <Image
                          src={safeImageSrc(member.detailInfo.profileImageUrl)}
                          alt={member.detailInfo.name}
                          fill
                          className="object-cover"
                          sizes="24px"
                        />
                      </div>
                      <a href={profileUrl} className="body_1_2 text-Gray-7 hover:underline">
                        {nickname}
                      </a>
                    </div>

                    <div className="w-20 t:w-16 d:w-45 px-3 t:px-3 d:px-4 py-3 shrink-0">
                      <p className="body_1_2 text-Gray-7">{member.detailInfo.name}</p>
                    </div>

                    <div className="hidden t:block t:w-39 d:w-56 t:px-3 d:px-4 py-3 shrink-0">
                      <p className="body_1_2 text-Gray-7 truncate">{member.detailInfo.email}</p>
                    </div>

                    <div className="w-28 t:w-23 d:w-56 px-3 t:px-3 d:px-4 py-3 shrink-0">
                      <p className="body_1_2 text-Gray-7">{joinDate}</p>
                    </div>

                    <div className="w-16 t:w-20 d:w-28 px-3 t:px-3 d:px-4 py-3 shrink-0">
                      <p className="body_1_2 text-Gray-7">
                        {getRoleLabelFromStatus(member.clubMemberStatus)}
                      </p>
                    </div>

                    <div
                      className="w-20 t:w-25 d:w-28 px-3 t:px-3 d:px-4 py-3 shrink-0 relative"
                      ref={(el) => {
                        menuRefs.current[member.clubMemberId] = el;
                      }}
                    >
                      <button
                        type="button"
                        ref={(el) => {
                          buttonRefs.current[member.clubMemberId] = el;
                        }}
                        onClick={() => handleRoleEdit(member.clubMemberId)}
                        disabled={isPending}
                        className="body_1_2 text-Gray-7 underline underline-offset-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <span className="t:hidden d:hidden">역할수정</span>
                        <span className="hidden t:inline">역할 수정</span>
                      </button>

                      <RoleEditDropdown
                        isOpen={openMenuId === member.clubMemberId}
                        member={member}
                        onSelectRole={(role) => handleSelectRole(member, role)}
                        onSelectPendingAction={(action) => handleSelectPendingAction(member, action)}
                        buttonRef={{ current: buttonRefs.current[member.clubMemberId] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            type="button"
            onClick={() => goToPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Image src="/ArrowLeft2.svg" alt="이전" width={16} height={16} className="object-contain" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            const isLoadMorePage = hasNextPage && page === totalPages;

            return (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                className={`px-3 py-1 body_1_2 ${
                  currentPage === page
                    ? "text-Gray-7 font-semibold"
                    : "text-Gray-4 hover:text-Gray-7"
                }`}
                title={isLoadMorePage ? "다음 페이지 불러오기" : undefined}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Image src="/ArrowRight2.svg" alt="다음" width={16} height={16} className="object-contain" />
          </button>
        </div>

        {isFetchingNextPage && (
          <p className="body_1_3 text-Gray-4 text-center mt-3">다음 페이지 불러오는 중...</p>
        )}
      </div>
    </div>
  );
}