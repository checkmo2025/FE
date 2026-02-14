// dummy.ts

export type BookDetailMock = {
  title: string;
  author: string;
  imageUrl: string;
  description: string;
  category: { generation: string; genre: string };
  rating: number; // 0~5 (0.5 가능)
};

export type MeetingInfoMock = {
  name: string;
  date: string; // "YYYY.MM.DD" 형태로 쓰는 중이라면 그대로
  location: string;
};

export type DebateTopicMock = {
  id: number;
  name: string;
  content: string;
};

export type TeamMemberMock = {
  id: string;
  name: string;
  profileImageUrl?: string;
};

export type TeamMock = {
  teamName: string;
  members: TeamMemberMock[];
};

export type ReviewMock = {
  id: number;
  name: string;
  content: string;
  rating: number; // 0~5 (0.5 가능)
  profileImageUrl?: string | null;
};

// --- Mock Data ---
export const MOCK_BOOK_DETAIL: BookDetailMock = {
  title: '채식주의자',
  author: '한강 지음',
  imageUrl: '/dummy_book_cover.png',
  description: `책을 좋아하는 사람들이 모여 각자의 속도로 읽고... (생략)`,
  category: { generation: '7기', genre: '소설/시/희곡' },
  rating: 4.5,
};

export const MOCK_MEETING_INFO: MeetingInfoMock = {
  name: '정기모임 이름 어쩌고',
  date: '2000.00.00',
  location: '제이스 스터디룸',
};

export const MOCK_DEBATE_TOPICS: DebateTopicMock[] = [
  {
    id: 1,
    name: '_hy_0716',
    content:
      "메노키오의 사례에서 볼 수 있듯이 시대마다 ‘허용되는 사상’과 ‘탄압받는 사상’이 존재한다. 현대사회에서 비슷한 사례는 무엇이 있을까?",
  },
  {
    id: 2,
    name: '_hy_0716',
    content: '표현의 자유는 어디까지 허용되어야 하는가? 플랫폼 규제는 검열인가 보호인가?',
  },
  {
    id: 3,
    name: '_hy_0716',
    content: '지금 우리가 ‘당연하다’고 믿는 상식 중, 훗날 탄압/조롱의 대상이 될 수도 있는 건 뭐가 있을까?',
  },
];

// 조별 멤버 데이터
export const MOCK_TEAMS_DATA: TeamMock[] = [
  {
    teamName: 'A조',
    members: [
      { id: '1', name: '유저 1', profileImageUrl: '/dummy_profile.png' },
      { id: '2', name: '유저 2', profileImageUrl: '/dummy_profile.png' },
      { id: '3', name: '유저 3', profileImageUrl: '/dummy_profile.png' },
    ],
  },
  {
    teamName: 'B조',
    members: [
      { id: '4', name: '유저 4' }, // 이미지 없는 경우 테스트
      { id: '5', name: '유저 5' },
    ],
  },
  { teamName: 'C조', members: [] },
  { teamName: 'D조', members: [] },
  { teamName: 'E조', members: [] },
  { teamName: 'F조', members: [] },
];

// ✅ 한줄평 더미 (ReviewSection / ReviewList에 그대로 꽂아 쓰는 용도)
export const MOCK_REVIEWS: ReviewMock[] = [
  {
    id: 1,
    name: '_hy_0716',
    rating: 4.5,
    content:
      '읽는 내내 불편한데, 그 불편함이 그냥 감정이 아니라 구조로 설계돼 있다는 게 무서웠다.',
    profileImageUrl: '/dummy_profile.png',
  },
  {
    id: 2,
    name: '루크',
    rating: 5,
    content:
      '한 문장씩 밟고 지나가는데, 어느 순간 발밑이 사라지는 느낌. 이게 문학이지 뭐.',
    profileImageUrl: null,
  },
  {
    id: 3,
    name: '유저 3',
    rating: 3.5,
    content:
      '좋게 말하면 강렬, 솔직히 말하면 기가 좀 빨림. 그래도 오래 남는다.',
    profileImageUrl: '/dummy_profile.png',
  },
];
