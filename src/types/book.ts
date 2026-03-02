export interface Book {
    isbn: string;
    title: string;
    author: string;
    imgUrl: string;
    publisher: string;
    description: string;
    link: string;
    likedByMe?: boolean;
}

export interface BookSearchResponse {
    detailInfoList: Book[];
    hasNext: boolean;
    currentPage: number;
    nextCursor?: number;
}

export interface MyLikedBooksResponse {
    books: Book[];
    hasNext: boolean;
    nextCursor?: number;
}
