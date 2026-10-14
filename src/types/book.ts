export interface Book {
    isbn: string;
    title: string;
    author: string;
    imgUrl: string;
    publisher: string;
    description: string;
    link: string | null;
    likedByMe?: boolean;
}

export interface BookSearchResponse {
    detailInfoList: Book[];
    hasNext: boolean;
    currentPage: number | null;
    totalResults: number;
}

export interface MyLikedBooksResponse {
    books: Book[];
    hasNext: boolean;
    nextCursor?: number;
}
