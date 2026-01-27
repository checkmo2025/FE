
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
  