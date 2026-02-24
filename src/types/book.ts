export interface Book {
    bookId: string;
    title: string;
    author: string;
    imgUrl: string;
    description: string;
}

export interface BookSearchResponse {
    books: Book[];
    hasNext: boolean;
    nextCursor: number | null;
    pageSize: number;
}
