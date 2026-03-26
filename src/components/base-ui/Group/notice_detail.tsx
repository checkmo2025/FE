'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import type {
  ClubNoticeMeetingDetail,
  ClubNoticeVoteDetail,
  ClubNoticeVoteMember,
} from '@/types/clubnotification';
import BookcaseCard from '../Bookcase/BookcaseCard';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  useDeleteClubNoticeMutation,
  useVoteClubNoticeMutation,
} from '@/hooks/mutations/useClubNotificationMutations';
import BookshelfDeleteConfirmModal from '../Bookcase/bookid/BookshelfDeleteConfirmModal';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

type NoticeDetailProps = {
  clubId: number;
  noticeId: number;
  title: string;
  content: string;
  date: string;
  isPinned?: boolean;
  tags?: readonly ('vote' | 'meeting')[];
  images?: string[];
  isAdmin?: boolean;
  meetingDetail?: ClubNoticeMeetingDetail | null;
  voteDetail?: ClubNoticeVoteDetail | null;
  editPath?: string;
};

const DEFAULT_PROFILE = '/profile4.svg';

function normalizeProfileSrc(src?: string | null) {
  if (!src || src.trim() === '') return DEFAULT_PROFILE;
  if (src.startsWith('http')) return src;
  if (src.startsWith('/')) return src;
  return `/${src}`;
}

type VoteMemberPopoverProps = {
  memberCount: number;
  members: ClubNoticeVoteMember[];
  isPublic: boolean;
};

function VoteMemberPopover({
  memberCount,
  members,
  isPublic,
}: VoteMemberPopoverProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useOnClickOutside(containerRef, () => {
    setIsOpen(false);
  });

  const normalizedMembers = useMemo(
    () =>
      members.map((member, index) => ({
        key: `${member.nickname}-${index}`,
        nickname: member.nickname,
        profileImageUrl: normalizeProfileSrc(member.profileImageUrl),
      })),
    [members]
  );

  const handleClickMember = (nickname: string) => {
    setIsOpen(false);
    router.push(`/profile/${encodeURIComponent(nickname)}`);
  };

  return (
    <div
      ref={containerRef}
      className="relative shrink-0"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        disabled={!isPublic}
        onClick={(e) => {
          e.stopPropagation();
          if (!isPublic) return;
          setIsOpen((prev) => !prev);
        }}
        className={`
          flex items-center gap-1 shrink-0 rounded-[6px] px-1 py-1 transition
          ${isPublic ? 'cursor-pointer hover:bg-Gray-1' : 'cursor-default'}
        `}
        aria-label={isPublic ? '투표한 인원 보기' : '비공개 투표'}
      >
        <Image
          src="/member.svg"
          alt="인원"
          width={24}
          height={24}
          className="shrink-0"
        />
        <span className="body_1_2 text-Gray-5 w-3 text-right">{memberCount}</span>
      </button>

      {isOpen && isPublic && (
        <div
          className="
            absolute left-0 top-full mt-2 z-[30]
            flex max-h-[292px] w-[236px] flex-col items-center
            rounded-[8px] border border-Subbrown-4 bg-White
            py-3 shadow-[0_3px_10px_rgba(61,52,46,0.12)]
          "
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="
              flex h-full w-full flex-col items-center overflow-y-auto
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
            "
          >
            {normalizedMembers.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center px-4 text-center text-Gray-4 body_2_3">
                투표한 인원이 없습니다.
              </div>
            ) : (
              normalizedMembers.map((member) => (
                <div
                  key={member.key}
                  className="flex w-[204px] items-center border-b border-Subbrown-4 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => handleClickMember(member.nickname)}
                    className="
                      flex w-[204px] items-center gap-3 px-2 py-2
                      text-left transition hover:bg-Gray-1 rounded-[8px]
                      cursor-pointer
                    "
                  >
                    <Image
                      src={member.profileImageUrl}
                      alt=""
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full object-cover shrink-0"
                    />
                    <span className="min-w-0 truncate text-Gray-7 body_1_3">
                      {member.nickname}
                    </span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NoticeDetail({
  clubId,
  noticeId,
  title,
  content,
  date,
  isPinned = false,
  tags,
  images,
  isAdmin = false,
  meetingDetail,
  voteDetail,
  editPath,
}: NoticeDetailProps) {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isRevoteMode, setIsRevoteMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { user } = useAuthStore();
  const myName = user?.nickname ?? '';

  const { mutateAsync: voteNotice, isPending: isVotePending } =
    useVoteClubNoticeMutation();
  const { mutateAsync: deleteNotice, isPending: isDeletePending } =
    useDeleteClubNoticeMutation();

  const votedOptionNumbers = useMemo(() => {
    if (!voteDetail) return [];

    return voteDetail.items
      .filter(
        (item) =>
          item.isSelected ||
          (!!myName &&
            item.votedMembers.some((member) => member.nickname === myName))
      )
      .map((item) => item.itemNumber);
  }, [voteDetail, myName]);

  const hasSubmittedVote = votedOptionNumbers.length > 0;
  const hasVoted = hasSubmittedVote && !isRevoteMode;

  useEffect(() => {
    setSelectedOptions(votedOptionNumbers);
    setIsRevoteMode(false);
  }, [votedOptionNumbers]);

  useEffect(() => {
    if (!isAdmin) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAdmin]);

  const handleOptionClick = (optionId: number) => {
    if (!voteDetail || hasVoted || isVotePending) return;

    if (voteDetail.duplication) {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleVoteSubmit = async () => {
    if (!voteDetail || selectedOptions.length === 0 || isVotePending) {
      return;
    }

    try {
      await voteNotice({
        clubId,
        noticeId,
        voteId: voteDetail.id,
        body: {
          selectedItemNumbers: selectedOptions,
        },
      });

      toast.success(isRevoteMode ? '투표가 수정되었습니다.' : '투표가 완료되었습니다.');
    } catch (e: any) {
      const msg = e?.message ?? '';
      toast.error(msg || '투표에 실패했습니다.');
    }
  };

  const handleRevote = () => {
    if (!voteDetail || isVotePending) return;

    setIsRevoteMode(true);
    setSelectedOptions([]);
  };

  const handleOpenDeleteModal = () => {
    if (!isAdmin || isDeletePending) return;
    setMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeletePending) return;
    setIsDeleteModalOpen(false);
  };

  const handleDeleteNotice = async () => {
    if (!isAdmin || isDeletePending) return;

    try {
      await deleteNotice({ clubId, noticeId });
      toast.success('공지사항이 삭제되었습니다.');
      router.push(`/groups/${clubId}/notice`);
    } catch (e: any) {
      const msg = e?.message ?? '';
      toast.error(msg || '공지사항 삭제에 실패했습니다.');
    } finally {
      setIsDeleteModalOpen(false);
      setMenuOpen(false);
    }
  };

  const handleEditNotice = () => {
    if (!isAdmin) return;
    setMenuOpen(false);
    router.push(editPath ?? `/groups/${clubId}/admin/notice/${noticeId}`);
  };

  const formatVoteDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  type TabParam = 'topic' | 'review' | 'meeting';
  const handleGoToDetail = (meetingId: number, tab: TabParam) => {
    router.push(`/groups/${clubId}/bookcase/${meetingId}?tab=${tab}`);
  };

  const renderBookcaseCard = () => {
    if (!meetingDetail) return null;

    return (
      <BookcaseCard
        key={meetingDetail.bookInfo.bookId}
        title={meetingDetail.bookInfo.title}
        author={meetingDetail.bookInfo.author}
        imageUrl={meetingDetail.bookInfo.imgUrl || '/dummy_book_cover.png'}
        category={{
          generation: `${meetingDetail.generation}기`,
          genre: meetingDetail.tag,
        }}
        rating={meetingDetail.averageRate}
        onTopicClick={() => handleGoToDetail(meetingDetail.meetingId, 'topic')}
        onReviewClick={() => handleGoToDetail(meetingDetail.meetingId, 'review')}
        onMeetingClick={() => handleGoToDetail(meetingDetail.meetingId, 'meeting')}
      />
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col t:flex-row gap-9">
        {meetingDetail && (
          <div className="hidden t:block shrink-0">{renderBookcaseCard()}</div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              {isPinned && (
                <div className="h-7 rounded flex items-center justify-center px-1 py-1 text-white body_1_2 shrink-0 bg-primary-1">
                  <div className="relative w-5 h-5">
                    <Image
                      src="/quill_pin.svg"
                      alt="고정"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              {tags && tags.length > 0 && (
                <>
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className={`h-7 rounded flex items-center justify-center px-2 py-1 text-white body_1_2 shrink-0 ${
                        tag === 'vote' ? 'bg-Secondary-3' : 'bg-Secondary-2'
                      }`}
                    >
                      {tag === 'vote' ? '투표' : '모임'}
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <span className="body_1_2 text-Gray-3">{date}</span>

              {isAdmin && (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="cursor-pointer"
                  >
                    <Image src="/menu_dots.svg" alt="메뉴" width={24} height={24} />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-34 h-22 rounded-lg bg-White z-10 px-2 shadow-md">
                      <button
                        type="button"
                        onClick={handleOpenDeleteModal}
                        className="flex w-full items-center gap-2 px-4 py-2.5 body_1_2 text-Gray-4 hover:text-Gray-7 cursor-pointer"
                      >
                        <Image src="/delete.svg" alt="삭제" width={24} height={24} />
                        삭제하기
                      </button>

                      <div className="mx-2 border-b border-Subbrown-4" />

                      <button
                        type="button"
                        onClick={handleEditNotice}
                        className="flex w-full items-center gap-2 px-4 py-2.5 body_1_2 text-Gray-4 hover:text-Gray-7 cursor-pointer"
                      >
                        <Image src="/edit2.svg" alt="수정" width={24} height={24} />
                        수정하기
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h2 className="subhead_2 t:headline_3 text-Gray-7 break-words">
              {title}
            </h2>
          </div>

          <p className="body_1_3 text-Gray-5 whitespace-pre-wrap min-w-[300px] max-w-full">
            {content}
          </p>
        </div>
      </div>

      {meetingDetail && (
        <div className="mt-4 flex justify-center t:hidden">
          <div className="w-full flex justify-center">{renderBookcaseCard()}</div>
        </div>
      )}

      <div>
        {images && images.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
              {images.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative shrink-0 w-25 h-35 t:w-56 t:h-56 d:w-100 d:h-100 rounded-lg overflow-hidden"
                >
                  <Image
                    src={imageUrl}
                    alt={`이미지 ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {voteDetail && (
          <div className="mt-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="body_1_2 text-Gray-4">
                투표종료 {formatVoteDate(voteDetail.deadline)}
              </span>
              <div className="flex items-center gap-3">
                {voteDetail.duplication && (
                  <div className="flex items-center gap-1">
                    <span className="body_1_2 text-Gray-3">중복 가능</span>
                    <Image
                      src="/duplicate.svg"
                      alt="중복 가능"
                      width={16}
                      height={16}
                    />
                  </div>
                )}
                {!voteDetail.anonymity && (
                  <div className="flex items-center gap-1">
                    <span className="body_1_2 text-Gray-3">공개</span>
                    <Image
                      src="/public.svg"
                      alt="공개"
                      width={16}
                      height={16}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              {voteDetail.items.map((option) => {
                const isSelected = selectedOptions.includes(option.itemNumber);
                const isDisabled = hasVoted || isVotePending;

                return (
                  <div
                    key={option.itemNumber}
                    onClick={() =>
                      !isDisabled && handleOptionClick(option.itemNumber)
                    }
                    className={`
                      flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors
                      ${
                        isSelected
                          ? 'border-primary-2 bg-Subbrown-4'
                          : 'border-Subbrown-3 bg-white hover:border-Subbrown-4'
                      }
                      ${isDisabled ? 'cursor-not-allowed opacity-60' : ''}
                    `}
                  >
                    <div
                      className={`
                        relative w-6 h-6 rounded-full border-2 shrink-0 bg-white
                        ${isSelected ? 'border-primary-2' : 'border-Gray-3'}
                      `}
                    >
                      {isSelected && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary-2" />
                      )}
                    </div>

                    <span className="body_1_2 text-Gray-7 flex-1">
                      {option.itemNumber}번: {option.item}
                    </span>

                    <VoteMemberPopover
                      memberCount={option.voteCount}
                      members={option.votedMembers}
                      isPublic={!voteDetail.anonymity}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button
                onClick={hasVoted ? handleRevote : handleVoteSubmit}
                disabled={!hasVoted && (selectedOptions.length === 0 || isVotePending)}
                className={`
                  w-[104px] h-[44px] px-6 py-3 rounded-lg body_1_2 transition-colors flex items-center justify-center box-border
                  ${
                    hasVoted
                      ? 'bg-Subbrown-4 border border-transparent text-primary-1 cursor-pointer hover:bg-Subbrown-3'
                      : selectedOptions.length > 0
                      ? 'bg-primary-1 text-white border border-transparent cursor-pointer hover:bg-primary-3 hover:text-white'
                      : 'bg-Gray-2 text-Gray-4 border border-transparent cursor-not-allowed'
                  }
                `}
              >
                {hasVoted ? '다시 투표' : isVotePending ? '투표 중...' : '투표하기'}
              </button>
            </div>
          </div>
        )}
      </div>

      <BookshelfDeleteConfirmModal
        isOpen={isDeleteModalOpen}
        isPending={isDeletePending}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteNotice}
        title="공지사항을 삭제할까요?"
        description="삭제 후 복구할 수 없습니다."
        confirmText="예"
        cancelText="아니요"
      />
    </div>
  );
}