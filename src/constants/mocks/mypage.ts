import {
  MyPageBookStory,
  MyPageLibraryBook,
  MyPageMeeting,
  MyPageNotification,
  UserProfileData,
} from "@/types/mypage";

export const DUMMY_USER_PROFILE: UserProfileData = {
  name: "_hy_0716",
  following: 12,
  subscribers: 123,
  intro:
    "이제 다양한 책을 함께 읽고 서로의 생각을 나누는 특별한 시간을 시작해보세요. 한 권의 책이 주는 작은 울림이 일상에 큰 변화를 가져올지도 모릅니다. 여러분의 이야기가 이 모임을 더욱 풍성하게 만들어줄 거예요.제 다양한 책을 함께 읽고 서로의 생각을 나누는 특별한 시간을 시작해보세요. 한 권의 책이 주는 작은 울림",
  profileImage: null,
};

export const DUMMY_MY_STORIES: MyPageBookStory[] = [
  {
    id: 1,
    authorName: "hy_0716",
    createdAt: "2023-10-25T10:00:00Z",
    viewCount: 128,
    title: "어린 왕자를 읽고 나서",
    content:
      "나는 나이든 왕자다. 그 누가 숫자가 중요하다가 했던가. 세고 또 세는 그런 마법같은 경험을 한사람은 놀랍도록 이세상에 얼마 안된다! 나는 숲이 아닌 바다란걸...",
    likeCount: 42,
    commentCount: 5,
    coverImgSrc: "/BookImgSample.svg",
  },
  {
    id: 2,
    authorName: "hy_0716",
    createdAt: "2023-10-20T14:30:00Z",
    viewCount: 85,
    title: "나의 라임 오렌지 나무",
    content:
      "제제, 너는 너무 조숙해. 하지만 우리는 모두 사랑받기 위해 태어난 존재란다. 밍기뉴와 함께한 시간들이...",
    likeCount: 23,
    commentCount: 2,
    coverImgSrc: "/BookImgSample.svg",
  },
  {
    id: 3,
    authorName: "hy_0716",
    createdAt: "2023-10-15T09:15:00Z",
    viewCount: 256,
    title: "데미안: 알을 깨고 나오다",
    content:
      "새는 알에서 나오려고 투쟁한다. 알은 세계다. 태어나려는 자는 하나의 세계를 깨뜨려야 한다. 아브락사스...",
    likeCount: 67,
    commentCount: 12,
    coverImgSrc: "/BookImgSample.svg",
  },
];

export const DUMMY_LIBRARY_BOOKS: MyPageLibraryBook[] = Array.from({
  length: 12,
}).map((_, i) => ({
  id: i + 1,
  src: "/BookImgSample.svg",
  title: `책 제목 ${i + 1}`,
  author: "저자 이름",
  publisher: "출판사",
  description: "이 책은 정말 재미있는 책입니다. 독서 모임에서 함께 읽어보세요.",
}));

export const DUMMY_MEETINGS: MyPageMeeting[] = [
  { id: 1, title: "북적북적" },
  { id: 2, title: "책 읽는 밤" },
  { id: 3, title: "마음의 양식" },
  { id: 4, title: "독서 토론회" },
];

export const DUMMY_NOTIFICATIONS: MyPageNotification[] = [
  {
    id: 1,
    content: "‘북적북적’ 모임의 새로운 공지사항이 등록되었습니다.",
    time: "1시간 전",
    isRead: false,
  },
  {
    id: 2,
    content: "‘책 읽는 밤’ 모임 참여 신청이 승인되었습니다.",
    time: "3시간 전",
    isRead: false,
  },
  {
    id: 3,
    content: "작성하신 ‘어린 왕자를 읽고 나서’ 글에 새로운 댓글이 달렸습니다.",
    time: "1일 전",
    isRead: true,
  },
  {
    id: 4,
    content: "‘마음의 양식’ 모임 일정이 변경되었습니다.",
    time: "2일 전",
    isRead: true,
  },
];
