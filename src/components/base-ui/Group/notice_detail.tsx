'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import type {
  ClubNoticeMeetingDetail,
  ClubNoticeVoteDetail,
} from '@/types/clubnotification';
import BookcaseCard from '../Bookcase/BookcaseCard';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  useDeleteClubNoticeMutation,
  useVoteClubNoticeMutation,
} from '@/hooks/mutations/useClubNotificationMutations';

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

  const handleDeleteNotice = async () => {
    if (!isAdmin || isDeletePending) return;

    const ok = window.confirm('공지사항을 삭제하시겠습니까?');
    if (!ok) return;

    try {
      await deleteNotice({ clubId, noticeId });
      toast.success('공지사항이 삭제되었습니다.');
      router.push(`/groups/${clubId}/notice`);
    } catch (e: any) {
      const msg = e?.message ?? '';
      toast.error(msg || '공지사항 삭제에 실패했습니다.');
    } finally {
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
        {/* 책장: t 이상에서만 노출 */}
        {meetingDetail && <div className="hidden t:block shrink-0">{renderBookcaseCard()}</div>}

        {/* 본문 */}
        <div className="flex-1 min-w-0">
          {/* 1줄: 고정/태그 | 날짜/메뉴 */}
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
                        onClick={handleDeleteNotice}
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

          {/* 2줄: 제목 */}
          <div className="mb-4">
            <h2 className="subhead_2 t:headline_3 text-Gray-7 break-words">
              {title}
            </h2>
          </div>

          {/* 3줄: 본문 */}
          <p className="body_1_3 text-Gray-5 whitespace-pre-wrap min-w-[300px] max-w-full">
            {content}
          </p>
        </div>
      </div>

      {/* 모바일 전용 책장: 본문 아래 / 이미지 위 */}
      {meetingDetail && (
        <div className="mt-4 flex justify-center t:hidden">
          <div className="w-full flex justify-center">{renderBookcaseCard()}</div>
        </div>
      )}

      <div>
        {/* 이미지 영역 */}
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

        {/* 투표 UI */}
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

                    <div className="flex items-center gap-1 shrink-0">
                      <Image
                        src="/member.svg"
                        alt="인원"
                        width={24}
                        height={24}
                        className="shrink-0"
                      />
                      <span className="body_1_2 text-Gray-5 w-3 text-right">
                        {option.voteCount}
                      </span>
                    </div>
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
    </div>
  );
}