'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import NoticeDetail from '@/components/base-ui/Group/notice_detail';
import VoteNoticeDetail from '@/components/base-ui/Group/vote_notice_detail';
import CommentSectionNotice from '@/components/base-ui/Comment/comment_section_notice';

import { useClubNoticeDetailQuery } from '@/hooks/queries/useClubNotificationQueries';


function formatKoreanDate(input: string) {
  const y = input.slice(0, 4);
  const m = input.slice(5, 7);
  const d = input.slice(8, 10);
  return `${y}.${m}.${d}`;
}

function mapTags(code?: string): readonly ('vote' | 'meeting')[] {
  switch (code) {
    case 'VOTE':
      return ['vote'] as const;
    case 'MEETING':
      return ['meeting'] as const;
    case 'VOTE_MEETING':
      return ['vote', 'meeting'] as const;
    default:
      return [] as const;
  }
}

export default function AdminNoticeDetailPage() {
  const params = useParams();

  const clubId = Number((params as any).id);
  const noticeId = Number((params as any).noticeId);

  const noticeQuery = useClubNoticeDetailQuery(clubId, noticeId);

  const viewModel = useMemo(() => {
    const data = noticeQuery.data;
    if (!data) return null;

    const tags = mapTags(data.tag?.code);
    const hasVote = !!data.voteDetail;

    // VoteNoticeDetail에 맞게 voteOptions 변환
    const voteOptions =
      data.voteDetail?.items?.map((it) => ({
        id: it.itemNumber,
        text: it.item,
        count: it.voteCount,
      })) ?? [];

    // VoteNoticeDetail prop 매핑 (duplication/anonymity)
    const allowMultiple = data.voteDetail?.duplication ?? false;
    const isPublic = data.voteDetail ? !data.voteDetail.anonymity : false; // 익명이 아니면 공개로 간주
    const voteEndDate = data.voteDetail?.deadline ?? '';

    return {
      title: data.title,
      content: data.content,
      date: formatKoreanDate(data.createdAt),
      isPinned: data.isPinned,
      tags,
      images: data.imageUrls ?? [],
      hasVote,

      voteOptions,
      voteEndDate,
      allowMultiple,
      isPublic,
    };
  }, [noticeQuery.data]);

  // ---- 상태 처리 ----
  if (!Number.isFinite(clubId) || !Number.isFinite(noticeId)) {
    return <div>잘못된 접근입니다.</div>;
  }

  if (noticeQuery.isLoading) {
    return <div>불러오는 중...</div>;
  }

  if (noticeQuery.isError) {
    return <div>공지사항을 불러오지 못했습니다.</div>;
  }

  if (!viewModel) {
    return <div>공지사항을 찾을 수 없습니다.</div>;
  }

  // 이 페이지는 admin 라우트니까 일단 true 고정
  const isAdmin = true;

  return (
    <div className="relative mx-auto w-full max-w-[1400px] px-[18px]">
      <div>
        <div className="w-full max-w-[1040px] px-0 t:mx-auto pt-6">
          {viewModel.hasVote ? (
            <VoteNoticeDetail
              title={viewModel.title}
              content={viewModel.content}
              date={viewModel.date}
              isPinned={viewModel.isPinned}
              tags={viewModel.tags}
              voteOptions={viewModel.voteOptions}
              voteEndDate={viewModel.voteEndDate}
              allowMultiple={viewModel.allowMultiple}
              isPublic={viewModel.isPublic}
              images={viewModel.images}
              isAdmin={isAdmin}
            />
          ) : (
            <NoticeDetail
              title={viewModel.title}
              content={viewModel.content}
              date={viewModel.date}
              isPinned={viewModel.isPinned}
              tags={viewModel.tags}
              images={viewModel.images}
            />
          )}
        </div>

        <div className="border-t-2 border-Gray-1 w-full max-w-[1040px] mx-auto px-[18px] mt-10 pt-6 pb-10">
          <CommentSectionNotice noticeId={noticeId} isAdminView />
        </div>
      </div>
    </div>
  );
}