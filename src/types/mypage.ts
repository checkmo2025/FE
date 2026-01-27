export interface UserProfileData {
  name: string;
  following: number;
  subscribers: number;
  intro: string;
  profileImage: string | null;
}

export interface MyPageBookStory {
  id: number;
  authorName: string;
  createdAt: string;
  viewCount: number;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  coverImgSrc: string;
}

export interface MyPageLibraryBook {
  id: number;
  src: string;
  title: string;
  author: string;
  publisher: string;
  description: string;
}

export interface MyPageMeeting {
  id: number;
  title: string;
}

export interface MyPageNotification {
  id: number;
  content: string;
  time: string;
  isRead: boolean;
}
