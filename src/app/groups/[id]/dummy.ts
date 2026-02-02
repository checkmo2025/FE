// dummy.ts (page.tsx와 같은 폴더)
import type { ClubHomeResponse, ClubHomeResponseResult,ClubModalLink } from '@/types/groups/grouphome';



export const DUMMY_CLUB_HOME_RESPONSE: ClubHomeResponse = {
  isSuccess: true,
  code: 'COMMON200',
  message: '성공입니다.',
  result: {
    clubId: 1,
    name: '서울 독서모임',
    profileImageUrl: null,
    region: '서울',
    category: [
      { code: 'HUMANITIES', description: '인문학' },
      { code: 'COMPUTER_IT', description: '컴퓨터/IT' },
      { code: 'ESSAY', description: '에세이' },
      { code: 'HISTORY_CULTURE', description: '역사/문화' },
    ],
    participantTypes: [
      { code: 'OFFLINE', description: '대면' },
      { code: 'WORKER', description: '직장인' },
      { code: 'STUDENT', description: '대학생' },
    ],
    open: true,

    description:
      '책을 좋아하는 사람들이 모여 각자의 속도로 읽고, 각자의 언어로 생각을 나누는 책 모임입니다. 정답을 찾기보다 질문을 남기는 시간을 소중히 여기며, 한 권의 책을 통해 서로의 관점과 경험을 자연스럽게 공유하는 것을 목표로 합니다.',
    recentNotice: {
      noticeId: 24,
      title: '공지사항_미리보기',
      createdAt: '2026-02-02T00:00:00.000Z',
      url: '/groups/1/notices/24',
    },
    links: {
      joinUrl: '/groups/1/join',
      contactUrl: '/contact',
    }, 

    modalLinks: [
      { id: 1, url: 'https://instagram.com/seoul_bookclub' },
      { id: 2, url: 'https://open.kakao.com/o/g0AbCDeF' },
      { id: 3, url: 'https://forms.gle/8YqZpZkQkQ2nH9rK9' },
    ],
  },
};


export const DUMMY_CLUB_HOME: ClubHomeResponseResult = DUMMY_CLUB_HOME_RESPONSE.result;
