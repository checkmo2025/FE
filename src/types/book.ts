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
}
