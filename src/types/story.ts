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


export interface BookInfo {
    bookId: string;
    title: string;
    author: string;
    imgUrl: string;
}

export interface AuthorInfo {
    nickname: string;
    profileImageUrl: string;
    following: boolean;
}

export interface CommentInfo {
    commentId: number;
    content: string;
    authorInfo: AuthorInfo | null;
    createdAt: string;
    writtenByMe: boolean;
    deleted: boolean;
    parentCommentId?: number | null;
    replies?: CommentInfo[];
}


export interface BookStoryDetail {
    bookStoryId: number;
    bookInfo: BookInfo;
    authorInfo: AuthorInfo;
    bookStoryTitle: string;
    description: string;
    likes: number;
    likedByMe: boolean;
    createdAt: string;
    writtenByMe: boolean;
    viewCount: number;
    commentCount: number;
    comments: CommentInfo[];
    prevBookStoryId: number;
    nextBookStoryId: number;
}

export interface CreateBookStoryRequest {
    isbn: string;
    title: string;
    description: string;
}

export interface CreateCommentRequest {
    content: string;
}

export interface UpdateBookStoryRequest {
    description: string;
}
