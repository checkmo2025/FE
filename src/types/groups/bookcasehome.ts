// src/types/bookcase.ts
const DEFAULT_BOOK_COVER = "/dummy_book_cover.png"; 
/** ===== API Raw Types ===== */
export type BookcaseApiResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: BookcaseApiResult;
};

export type BookcaseApiResult = {
  bookShelfInfoList: BookShelfInfo[];
  hasNext: boolean;
  nextCursor: string | null;
};

export type BookShelfInfo = {
  meetingInfo: MeetingInfo;
  bookInfo: BookInfo;
};

export type MeetingInfo = {
  meetingId: number;
  generation: number; // 1,2,3...
  tag: "MEETING" | string; // 서버가 더 늘리면 string으로 대응
  averageRate: number; // 평점(0~5 같은 값일 가능성)
};

export type BookInfo = {
  bookId: string; // ISBN 같은 문자열
  title: string;
  author: string;
  imgUrl: string | null;
};

/** ===== UI View Model Types (BookcaseCard에 꽂기 좋은 형태) ===== */
export type BookcaseCardCategory = {
  generation: string; // "1기" 같은 라벨
  genre: string; // 서버에 장르 없으니 tag 등으로 대체
};

export type BookcaseCardModel = {
  bookId: string;
  title: string;
  author: string;
  imageUrl: string;
  category: BookcaseCardCategory;
  rating: number;
  meetingId: number;
  generationNumber: number;
  tag: string;
};

export type BookcaseSectionModel = {
  generationNumber: number;
  generationLabel: string; // "1기"
  books: BookcaseCardModel[];
};

/** ===== Mapper / Grouping Utils ===== */
export const toBookcaseCardModel = (item: BookShelfInfo): BookcaseCardModel => ({
  bookId: item.bookInfo.bookId,
  title: item.bookInfo.title,
  author: item.bookInfo.author,
  imageUrl: item.bookInfo.imgUrl ?? DEFAULT_BOOK_COVER,
  category: {
    generation: `${item.meetingInfo.generation}기`,
    genre: item.meetingInfo.tag, // 서버에 genre 없으니 tag를 박아둠
  },
  rating: item.meetingInfo.averageRate ?? 0,
  meetingId: item.meetingInfo.meetingId,
  generationNumber: item.meetingInfo.generation,
  tag: item.meetingInfo.tag,
});

export const groupByGeneration = (list: BookShelfInfo[]): BookcaseSectionModel[] => {
  const map = new Map<number, BookcaseCardModel[]>();

  for (const item of list) {
    const gen = item.meetingInfo.generation;
    const arr = map.get(gen) ?? [];
    arr.push(toBookcaseCardModel(item));
    map.set(gen, arr);
  }

  return Array.from(map.entries())
    .sort((a, b) => b[0] - a[0]) // 최신 기수 먼저 (원하면 반대로)
    .map(([generationNumber, books]) => ({
      generationNumber,
      generationLabel: `${generationNumber}기`,
      books,
    }));
};
