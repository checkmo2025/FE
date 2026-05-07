'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import NoticeDetail from '@/components/base-ui/Group/notice_detail';
import CommentSectionNotice from '@/components/base-ui/Comment/comment_section_notice';
import { useClubNoticeDetailQuery } from '@/hooks/queries/useClubNotificationQueries';
import { useClubMeQuery } from '@/hooks/queries/useClubhomeQueries';

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

export default function NoticeDetailPage() {
  const params = useParams();

  const clubId = Number(params.id);
  const noticeId = Number(params.noticeId);

  const noticeQuery = useClubNoticeDetailQuery(clubId, noticeId);
  const { data: meData } = useClubMeQuery(clubId);

  const isAdmin = !!meData?.staff;

  const viewModel = useMemo(() => {
    const data = noticeQuery.data;
    if (!data) return null;

    return {
      title: data.title,
      content: data.content,
      date: formatKoreanDate(data.createdAt),
      isPinned: data.isPinned,
      tags: mapTags(data.tag?.code),
      images: data.imageUrls ?? [],
      meetingDetail: data.meetingDetail ?? null,
      voteDetail: data.voteDetail ?? null,
    };
  }, [noticeQuery.data]);

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

  return (
    <div className="relative mx-auto w-full max-w-[1400px] px-[18px]">
      <div>
        <div className="w-full max-w-[1040px] px-0 t:mx-auto pt-6">
          <NoticeDetail
            clubId={clubId}
            noticeId={noticeId}
            title={viewModel.title}
            content={viewModel.content}
            date={viewModel.date}
            isPinned={viewModel.isPinned}
            tags={viewModel.tags}
            images={viewModel.images}
            isAdmin={isAdmin}
            meetingDetail={viewModel.meetingDetail}
            voteDetail={viewModel.voteDetail}
            editPath={`/groups/${clubId}/admin/notice/${noticeId}`}
          />
        </div>

        <div className="border-t-2 border-Gray-1 w-full max-w-[1040px] mx-auto px-[18px] mt-10 pt-6 pb-10">
          <CommentSectionNotice noticeId={noticeId} isAdminView={isAdmin} />
        </div>
      </div>
    </div>
  );
}