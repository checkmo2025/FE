'use client';

import { useParams, useRouter } from 'next/navigation';
import NoticeItem from '@/components/base-ui/Group/notice_item';

export default function GroupNoticePage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  // 더미 데이터
  const pinnedNotices = [
    {
      id: 1,
      title: '긁적긁적 독서 모임 공지사항',
      content: '이번 주 모임은 정상적으로 진행됩니다. 많은 참여 부탁드립니다.',
      date: '2025.01.15',
    },
    {
      id: 2,
      title: '새로운 책 추천 받습니다',
      content: '이번 달 읽을 책을 추천해주세요. 추천하신 책 중에서 선정하겠습니다.',
      date: '2025.01.10',
    },
  ];

  const notices = [
    {
      id: 3,
      title: '1월 독서 후기 공유',
      content: '1월에 읽으신 책들의 후기를 공유해주세요.',
      date: '2025.01.05',
      tags: ['vote'] as const,
    },
    {
      id: 4,
      title: '모임 장소 변경 안내',
      content: '다음 모임부터 장소가 변경됩니다. 자세한 내용은 확인해주세요.',
      date: '2024.12.28',
      tags: ['vote', 'meeting'] as const,
    },
    {
      id: 5,
      title: '연말 모임 안내',
      content: '연말 특별 모임을 준비했습니다. 많은 참여 부탁드립니다.',
      date: '2024.12.20',
      tags: ['meeting'] as const,
    },
  ];

  const handleNoticeClick = (id: number) => {
    router.push(`/groups/${groupId}/notice/${id}`);
  };

  return (
    <div className="w-full">
      {/* 고정 공지사항 */}
      {pinnedNotices.length > 0 && (
        <div className="mb-3 flex flex-col gap-3">
          {pinnedNotices.map((notice) => (
            <NoticeItem
              key={notice.id}
              id={notice.id}
              title={notice.title}
              content={notice.content}
              date={notice.date}
              isPinned={true}
              onClick={() => handleNoticeClick(notice.id!)}
            />
          ))}
        </div>
      )}

      {/* 일반 공지사항 */}
      <div className="flex flex-col gap-3">
        {notices.map((notice) => (
          <NoticeItem
            key={notice.id}
            id={notice.id}
            title={notice.title}
            content={notice.content}
            date={notice.date}
            isPinned={false}
            tags={notice.tags}
            onClick={() => handleNoticeClick(notice.id!)}
          />
        ))}
      </div>
    </div>
  );
}
