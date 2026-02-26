'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useHeaderTitle } from '@/contexts/HeaderTitleContext';

import { useInfiniteClubMembersQuery } from '@/hooks/queries/useClubMemberQueries';
import { useUpdateClubMemberStatusMutation } from '@/hooks/mutations/useClubMemberMutations';
import type { ClubMemberItem } from '@/types/groups/clubMembers';

type ActionType = 'delete' | 'approve';

type ApplicantActionDropdownProps = {
  isOpen: boolean;
  onSelectAction: (action: ActionType) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
};

function ApplicantActionDropdown({
  isOpen,
  onSelectAction,
  buttonRef,
}: ApplicantActionDropdownProps) {
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

  return (
    <div
      className="fixed w-34 h-22 rounded-lg border border-Subbrown-4 bg-White shadow-md z-50 flex flex-col"
      style={{ top: position.top, left: position.left }}
    >
      <button
        type="button"
        onClick={() => onSelectAction('delete')}
        className="flex-1 w-full flex items-center justify-center gap-2 body_1_2 text-Gray-4 hover:text-Gray-7 cursor-pointer"
      >
        <Image src="/delete.svg" alt="삭제" width={24} height={24} />
        삭제하기
      </button>
      <div className="mx-3 border-b border-Subbrown-4" />
      <button
        type="button"
        onClick={() => onSelectAction('approve')}
        className="flex-1 w-full flex items-center justify-center gap-2 body_1_2 text-Gray-4 hover:text-Gray-7 cursor-pointer"
      >
        <Image src="/accept.svg" alt="가입" width={24} height={24} />
        가입처리
      </button>
    </div>
  );
}

type JoinMessageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
};

function JoinMessageModal({ isOpen, onClose, message }: JoinMessageModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={onClose}
    >
      <div
        className="w-100 h-45 rounded-lg bg-White p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="body_1_2 text-Gray-4 whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
}

function formatYYYYMMDD(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '0000.00.00';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

export default function AdminApplicantPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string; // clubId
  const clubId = Number(groupId);

  const { setCustomTitle } = useHeaderTitle();

  // dropdown / modal
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [messageModal, setMessageModal] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: '',
  });

  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  // pagination UI는 유지하되, 데이터는 cursor 기반으로 누적 로드해서 slice로 보여줌
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ PENDING만 조회 (cursorId 무한 스크롤)
  const membersQuery = useInfiniteClubMembersQuery(
    clubId,
    'PENDING',
    Number.isFinite(clubId) && clubId > 0
  );

  const { mutateAsync: updateStatus, isPending: isUpdating } =
    useUpdateClubMemberStatusMutation();

  // 서버 데이터 -> 기존 UI shape에 맞춰 가공
  const applicants = useMemo(() => {
    const pages = membersQuery.data?.pages ?? [];
    const raw: ClubMemberItem[] = pages.flatMap((p) => p.clubMembers ?? []);

    return raw.map((m) => ({
      id: m.clubMemberId,
      userId: m.detailInfo.nickname, // 기존 UI에 보이던 ID 자리에 nickname
      name: m.detailInfo.name,
      email: m.detailInfo.email,
      applyDate: formatYYYYMMDD(m.appliedAt),
      message: m.joinMessage ?? '',
      profileImageUrl: m.detailInfo.profileImageUrl ?? null,
      nickname: m.detailInfo.nickname,
    }));
  }, [membersQuery.data]);

  // 페이지네이션 계산
  const totalPages = Math.max(1, Math.ceil(applicants.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplicants = applicants.slice(startIndex, endIndex);

  // 모바일 헤더 타이틀 설정
  useEffect(() => {
    setCustomTitle('가입 신청 관리');
    return () => setCustomTitle(null);
  }, [setCustomTitle]);

  // 바깥 클릭 시 메뉴 닫기 (기존 로직 유지)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openMenuId === null) return;
      const menuRef = menuRefs.current[openMenuId];
      const buttonRef = buttonRefs.current[openMenuId];
      const target = e.target as Node;

      if (menuRef && menuRef.contains(target)) return;
      if (buttonRef && buttonRef.contains(target)) return;

      setOpenMenuId(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  // ✅ “페이지 넘겼는데 데이터가 모자라면” 다음 cursor 페이지 자동 로드
  useEffect(() => {
    if (!membersQuery.hasNextPage) return;
    if (membersQuery.isFetchingNextPage) return;

    const needCount = currentPage * itemsPerPage;
    if (applicants.length < needCount) {
      membersQuery.fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, applicants.length, membersQuery.hasNextPage, membersQuery.isFetchingNextPage]);

  // 데이터 줄어들어서 현재 페이지가 totalPages를 넘는 상황 방지
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleActionClick = (applicantId: number) => {
    setOpenMenuId(openMenuId === applicantId ? null : applicantId);
  };

  const handleSelectAction = async (clubMemberId: number, action: ActionType) => {
    // action 매핑:
    // delete -> REJECT (PENDING 삭제)
    // approve -> APPROVE (PENDING -> MEMBER)
    try {
      if (action === 'delete') {
        await updateStatus({
          clubId,
          clubMemberId,
          body: {
            command: 'REJECT'
          },
        });
      } else {
        await updateStatus({
          clubId,
          clubMemberId,
          body: {
            command: 'APPROVE',
          },
        });
      }
    } finally {
      setOpenMenuId(null);
    }
  };

  const handleMessageClick = (message: string) => {
    setMessageModal({ isOpen: true, message });
  };

  const handleCloseMessageModal = () => {
    setMessageModal({ isOpen: false, message: '' });
  };

  const goProfile = (nickname: string) => {
    router.push(`/profile/${nickname}`);
  };

  return (
    <div className="w-full">
      <div className="t:hidden px-2.5 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-Gray-7 body_1_2"
        >
          <Image src="/back.svg" alt="뒤로가기" width={12} height={12} />
          <span>뒤로가기</span>
        </button>
      </div>
      <div className="t:hidden border-b border-Gray-2" />

      <div className="px-4.5 t:px-10 d:px-4">
        <div className="mx-auto w-full max-w-260 py-6">
          <div className="mb-2">
            <h1 className="subhead_1 t:subhead_3 text-Gray-7">모임 가입 신청 관리</h1>
          </div>
          <div className="mb-6">
            <p className="body_1_3 text-Gray-4 whitespace-pre-line">
              운영진은 가입 처리를 통해 회원의 가입 유무를 선택 가능합니다. <br /> 이때 공개모임의 경우
              모든 신청마다 즉시 가입완료 처리 됩니다.
            </p>
          </div>

          {/* 로딩/에러 표시(기존 UI는 유지하면서 최소만 추가) */}
          {membersQuery.isLoading && (
            <p className="body_1_2 text-Gray-4 mb-3">불러오는 중…</p>
          )}
          {membersQuery.isError && (
            <p className="body_1_2 text-Error mb-3">목록을 불러오지 못했습니다.</p>
          )}

          {/* 테이블 */}
          <div className="w-full">
            <div>
              {/* 테이블 헤더 */}
              <div className="flex items-center border-b border-Subbrown-3">
                <div className="hidden t:block t:w-28 d:w-45 t:px-3 d:px-4 py-3 shrink-0">
                  <p className="body_1_2 text-Gray-4">ID</p>
                </div>
                <div className="w-14 t:w-16 d:w-45 py-3 t:px-3 d:px-4 shrink-0">
                  <p className="body_1_2 text-Gray-4">이름</p>
                </div>
                <div className="hidden t:block t:w-40 d:w-42 t:px-3 d:px-4 py-3 shrink-0">
                  <p className="body_1_2 text-Gray-4">이메일</p>
                </div>
                <div className="w-24 t:w-24 d:w-42 py-3 t:px-3 d:px-4 shrink-0">
                  <p className="body_1_2 text-Gray-4">신청 일자</p>
                </div>
                <div className="w-14 t:w-24 d:w-28 py-3 t:px-3 d:px-4 shrink-0">
                  <p className="body_1_2 text-Gray-4 t:hidden">프로필</p>
                  <p className="body_1_2 text-Gray-4 hidden t:block">프로필 보기</p>
                </div>
                <div className="w-20 t:w-24 d:w-28 py-3 t:px-3 d:px-4 shrink-0">
                  <p className="body_1_2 text-Gray-4">가입메시지</p>
                </div>
                <div className="w-12 t:w-20 d:w-28 py-3 t:px-3 d:px-4 shrink-0">
                  <p className="body_1_2 text-Gray-4">수정</p>
                </div>
              </div>

              {/* 테이블 바디 */}
              <div className="divide-y divide-Subbrown-4 border-b border-Subbrown-4 overflow-visible">
                {currentApplicants.map((applicant) => (
                  <div key={applicant.id} className="flex items-center">
                    <div className="hidden t:flex t:w-28 d:w-45 h-15 t:px-3 d:px-4 py-3 items-center gap-2 shrink-0">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0">
                        <Image
                          src={applicant.profileImageUrl || '/profile2.svg'}
                          alt={applicant.name}
                          fill
                          className="object-cover"
                          sizes="24px"
                        />
                      </div>
                      <p className="body_1_2 text-Gray-7 truncate">{applicant.userId}</p>
                    </div>

                    <div className="w-14 t:w-16 d:w-45 py-3 t:px-3 d:px-4 shrink-0">
                      <p className="body_1_2 text-Gray-7">{applicant.name}</p>
                    </div>

                    <div className="hidden t:block t:w-40 d:w-42 t:px-3 d:px-4 py-3 shrink-0">
                      <p className="body_1_2 text-Gray-7 truncate">{applicant.email}</p>
                    </div>

                    <div className="w-24 t:w-24 d:w-42 py-3 t:px-3 d:px-4 shrink-0">
                      <p className="body_1_2 text-Gray-7">{applicant.applyDate}</p>
                    </div>

                    <div className="w-14 t:w-24 d:w-28 py-3 t:px-3 d:px-4 shrink-0">
                      <button
                        type="button"
                        onClick={() => goProfile(applicant.nickname)}
                        className="body_1_2 text-Gray-7 underline underline-offset-2 cursor-pointer"
                      >
                        바로가기
                      </button>
                    </div>

                    <div className="w-20 t:w-24 d:w-28 py-3 t:px-3 d:px-4 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMessageClick(applicant.message)}
                        className="body_1_2 text-Gray-7 underline underline-offset-2 cursor-pointer"
                      >
                        가입메시지
                      </button>
                    </div>

                    <div
                      className="w-12 t:w-20 d:w-28 py-3 t:px-3 d:px-4 shrink-0 relative"
                      ref={(el) => {
                        menuRefs.current[applicant.id] = el;
                      }}
                    >
                      <button
                        type="button"
                        ref={(el) => {
                          buttonRefs.current[applicant.id] = el;
                        }}
                        onClick={() => handleActionClick(applicant.id)}
                        disabled={isUpdating}
                        className="body_1_2 text-Gray-7 underline underline-offset-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        수정
                      </button>

                      <ApplicantActionDropdown
                        isOpen={openMenuId === applicant.id}
                        onSelectAction={(action) => handleSelectAction(applicant.id, action)}
                        buttonRef={{ current: buttonRefs.current[applicant.id] }}
                      />
                    </div>
                  </div>
                ))}

                {!membersQuery.isLoading && applicants.length === 0 && !membersQuery.isError && (
                  <div className="py-10 text-center">
                    <p className="body_1_2 text-Gray-4">가입 대기(PENDING) 멤버가 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 페이지네이션 (UI 그대로 유지) */}
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Image src="/ArrowLeft2.svg" alt="이전" width={16} height={16} className="object-contain" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 body_1_2 ${
                  currentPage === page ? 'text-Gray-7 font-semibold' : 'text-Gray-4 hover:text-Gray-7'
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
              <Image src="/ArrowRight2.svg" alt="다음" width={16} height={16} className="object-contain" />
            </button>
          </div>

          {/* “더 가져올 게 있는데 아직 페이지 수가 부족한” 케이스 안내 (선택) */}
          {membersQuery.hasNextPage && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => membersQuery.fetchNextPage()}
                disabled={membersQuery.isFetchingNextPage}
                className="body_1_2 text-Gray-7 underline underline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {membersQuery.isFetchingNextPage ? '불러오는 중…' : '더 불러오기'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 가입 메시지 모달 */}
      <JoinMessageModal
        isOpen={messageModal.isOpen}
        onClose={handleCloseMessageModal}
        message={messageModal.message}
      />
    </div>
  );
}