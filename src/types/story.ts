export interface BookStory {
    bookStoryId: number;
    bookInfo: {
        bookId: number;
        title: string;
        author: string;
        imgUrl: string;
    };
    authorInfo: {
        nickname: string;
        profileImageUrl: string;
        following: boolean;
    };
    bookStoryTitle: string;
    description: string;
    likes: number;
    commentCount: number;
    viewCount: number;
    likedByMe: boolean;
    createdAt: string;
    writtenByMe: boolean;
}

export interface BookStoryListResponse {
    basicInfoList: BookStory[];
    hasNext: boolean;
    nextCursor: number | null;
    pageSize: number;
}
