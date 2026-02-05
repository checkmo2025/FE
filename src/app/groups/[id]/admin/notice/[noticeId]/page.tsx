'use client';

import { useParams } from 'next/navigation';
import NoticeDetail from '@/components/base-ui/Group/notice_detail';
import VoteNoticeDetail from '@/components/base-ui/Group/vote_notice_detail';
import CommentSectionNotice from '@/components/base-ui/Comment/comment_section_notice';

// 더미 데이터
const DUMMY_NOTICES = [
  {
    id: 1,
    title: '긁적긁적 독서 모임 공지사항',
    content: '이번 주 모임은 정상적으로 진행됩니다. 많은 참여 부탁드립니다.',
    date: '2025.01.15',
    isPinned: true,
    tags: [] as const,
    images: ['/news_sample2.png', '/news_sample3.png'],
  },
  {
    id: 2,
    title: '새로운 책 추천 받습니다',
    content: '이번 달 읽을 책을 추천해주세요. 추천하신 책 중에서 선정하겠습니다.',
    date: '2025.01.10',
    isPinned: true,
    tags: [] as const,
  },
  {
    id: 3,
    title: '1월 독서 후기 공유',
    content: '1월에 읽으신 책들의 후기를 공유해주세요.',
    date: '2025.01.05',
    isPinned: false,
    tags: ['vote'] as const,
    voteOptions: [
      { id: 1, text: '어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고', count: 10 },
      { id: 2, text: '어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고', count: 5 },
      { id: 3, text: '어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고어쩌고저쩌고', count: 3 },
    ],
    voteEndDate: '2025-01-01T17:05:00',
    allowMultiple: true,
    isPublic: true,
  },
  {
    id: 4,
    title: '모임 장소 변경 안내',
    content: '다음 모임부터 장소가 변경됩니다. 자세한 내용은 확인해주세요.',
    date: '2024.12.28',
    isPinned: false,
    tags: ['vote', 'meeting'] as const,
    voteOptions: [
      { id: 1, text: '옵션 1', count: 8 },
      { id: 2, text: '옵션 2', count: 12 },
    ],
    voteEndDate: '2025-01-15T12:00:00',
    allowMultiple: false,
    isPublic: true,
  },
  {
    id: 5,
    title: '연말 모임 안내',
    content: '연말 특별 모임을 준비했습니다. 많은 참여 부탁드립니다.',
    date: '2024.12.20',
    isPinned: false,
    tags: ['meeting'] as const,
  },
];

export default function AdminNoticeDetailPage() {
  const params = useParams();
  const noticeId = params.noticeId as string;
  const notice = DUMMY_NOTICES.find((n) => n.id === Number(noticeId));

  if (!notice) {
    return <div>공지사항을 찾을 수 없습니다.</div>;
  }

  const hasVote =
    notice.tags && notice.tags.length > 0 && notice.tags.some((tag) => tag === 'vote');

  return (
    <div className="relative mx-auto w-full max-w-[1400px] px-[18px]">
      {/* 메인 콘텐츠 영역 */}
      <div>
        {/* 공지사항 상세 */}
        <div className="w-full max-w-[1040px] px-0 t:mx-auto pt-6">
          {hasVote ? (
            <VoteNoticeDetail
              title={notice.title}
              content={notice.content}
              date={notice.date}
              isPinned={notice.isPinned}
              tags={notice.tags}
              voteOptions={notice.voteOptions || []}
              voteEndDate={notice.voteEndDate || ''}
              allowMultiple={notice.allowMultiple || false}
              isPublic={notice.isPublic || false}
              images={notice.images}
              isAdmin
            />
          ) : (
            <NoticeDetail
              title={notice.title}
              content={notice.content}
              date={notice.date}
              isPinned={notice.isPinned}
              tags={notice.tags}
              images={notice.images}
            />
          )}
        </div>

        {/* 운영진 댓글: 가리기 메뉴 노출 */}
        <div className="border-t-2 border-Gray-1 w-full max-w-[1040px] mx-auto px-[18px] mt-10 pt-6 pb-10">
          <CommentSectionNotice noticeId={Number(noticeId)} isAdminView />
        </div>
      </div>
    </div>
  );
}

