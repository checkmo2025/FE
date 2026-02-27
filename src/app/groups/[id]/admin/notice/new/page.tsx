"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import BookshelfModal from "@/components/base-ui/Group/BookshelfModal";
import BookDetailCard from "@/components/base-ui/Bookcase/BookDetailCard";
import { useHeaderTitle } from "@/contexts/HeaderTitleContext";
import { CreateClubNoticeRequest, CreateClubNoticeVote } from "@/types/clubnotification";



type Book = {
  id: number;
  title: string;
  author: string;
  category: { generation: string; genre: string };
  rating: number;
  description: string;
};

export default function NewNoticePage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  const { setCustomTitle } = useHeaderTitle();

  // 기본 입력
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 동시 가능 토글
  const [isVoteEnabled, setIsVoteEnabled] = useState(false);
  const [isImageEnabled, setIsImageEnabled] = useState(false);

  // 중요여부(핀)
  const [isPinned, setIsPinned] = useState(false);

  // 투표 상태 (✅ 제목/설명 UI 없음. payload는 빈 문자열로 보냄)
  const [voteItems, setVoteItems] = useState<string[]>(["", ""]); // ✅ 기본 2개
  const [isMultiple, setIsMultiple] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // deadline UI (date + time)
  const [deadlineDate, setDeadlineDate] = useState(""); // YYYY-MM-DD
  const [deadlineTime, setDeadlineTime] = useState(""); // HH:mm
  const [isDeadlineEditing, setIsDeadlineEditing] = useState(false);
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const timeInputRef = useRef<HTMLInputElement | null>(null);

  // 책장
  const [isBookshelfModalOpen, setIsBookshelfModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // 이미지
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const hasImages = imagePreviews.length > 0;

  // 본문 자동 높이
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const adjustContentHeight = () => {
    const ta = contentRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  };

  // 모바일 헤더 타이틀
  useEffect(() => {
    setCustomTitle("공지사항 작성");
    return () => setCustomTitle(null);
  }, [setCustomTitle]);

  useEffect(() => {
    adjustContentHeight();
  }, [content]);

  // objectURL 정리
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleCancel = () => router.back();

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setIsBookshelfModalOpen(false);
  };

  const handleRemoveBook = () => setSelectedBook(null);

  const handleVoteItemChange = (index: number, value: string) => {
    setVoteItems((prev) => prev.map((it, i) => (i === index ? value : it)));
  };

  const addVoteItem = () => {
    setVoteItems((prev) => {
      if (prev.length >= 6) return prev;
      return [...prev, ""];
    });
  };

  const handleImageFile = () => {
    setIsImageEnabled(true);
    imageInputRef.current?.click();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...urls]);
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const url = imagePreviews[index];
    if (url) URL.revokeObjectURL(url);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // deadline ISO 만들기 (date + time 둘 다 있을 때만)
  const voteDeadlineISO = useMemo(() => {
    if (!deadlineDate || !deadlineTime) return null;
    const [y, m, d] = deadlineDate.split("-").map(Number);
    const [hh, mm] = deadlineTime.split(":").map(Number);
    if (!y || !m || !d || hh === undefined || mm === undefined) return null;
    const dt = new Date(y, m - 1, d, hh, mm, 0, 0);
    return dt.toISOString();
  }, [deadlineDate, deadlineTime]);

  const mapVoteItemsToRequest = (items: string[]) => {
    const trimmed = items.map((v) => v.trim()).filter(Boolean).slice(0, 6);
    return {
      item1: trimmed[0],
      item2: trimmed[1],
      item3: trimmed[2],
      item4: trimmed[3],
      item5: trimmed[4],
      item6: trimmed[5],
    };
  };

  const handleSubmit = () => {
    const nowISO = new Date().toISOString();

    const vote: CreateClubNoticeVote | null =
      isVoteEnabled
        ? {
            // ✅ UI엔 없지만 서버 스펙상 필요해서 빈 문자열로 보냄
            title: "",
            content: "",
            ...mapVoteItemsToRequest(voteItems),
            anonymity: isAnonymous,
            duplication: isMultiple,
            startTime: nowISO,
            deadline: voteDeadlineISO ?? nowISO,
          }
        : null;

    const payload: CreateClubNoticeRequest = {
      title,
      content,
      meetingId: 0,
      imageUrls: isImageEnabled ? imagePreviews : [],
      vote,
      isPinned,
    };

    console.log("CreateClubNotice payload:", payload);
    router.push(`/groups/${groupId}/admin/notice`);
  };

  // 활성 표시 (opacity + 약한 그림자만)
  const glow = "drop-shadow-[0_0_6px_rgba(0,0,0,0.10)]";
  const isBookshelfActive = !!selectedBook;

  return (
    <div className="w-full">
      <div className="t:hidden border-b border-Gray-2" />

      <div className="py-4 t:pt-6 px-3 t:px-10">
        <div className="flex justify-center">
          <div className="w-full max-w-[1040px]">
            <p className="subhead_4_1 text-Gray-7 px-2 t:px-1 d:px-0 mb-3">
              공지사항 작성
            </p>

            {/* 선택된 책 표시 + X */}
            {selectedBook && (
              <div className="relative mb-4 p-4 rounded-[8px] bg-White border border-Subbrown-4">
                <button
                  type="button"
                  onClick={handleRemoveBook}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center"
                  aria-label="선택한 책 제거"
                >
                  <Image
                    src="/icon_minus_2.svg"
                    alt="삭제"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </button>

                <BookDetailCard
                  title={selectedBook.title}
                  author={selectedBook.author}
                  description={selectedBook.description}
                  category={selectedBook.category}
                  rating={selectedBook.rating}
                />
              </div>
            )}

            {/* 공지 박스: 내부 고정 + 하단 고정 */}
            <div className="relative w-full border border-Subbrown-4 t:border-2 bg-White rounded-[8px]">
              {/* 내용 영역 */}
              <div className="flex flex-col min-h-[300px] t:min-h-[500px]">
                <div className="flex-1 overflow-auto">
                  {/* 제목 */}
                  <div className="flex px-6 py-4 items-center border-b border-b-Subbrown-4">
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="제목을 입력해주세요."
                      className="w-full bg-transparent outline-none text-Gray-7 subhead_4_1 placeholder:text-Gray-3"
                    />
                  </div>

                  {/* 내용 */}
                  <div className="px-6 py-4">
                    <textarea
                      ref={contentRef}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      onInput={adjustContentHeight}
                      placeholder="내용을 입력해주세요"
                      rows={1}
                      className="
                        w-full min-w-0 resize-none bg-transparent outline-none
                        overflow-hidden
                        text-Gray-7 body_1_3 placeholder:text-Gray-3
                        whitespace-pre-wrap
                      "
                    />
                  </div>

                  {/* 투표 */}
                  {isVoteEnabled && (
                    <div className="px-6 pb-4">
                      <div className="rounded-[8px] bg-background border border-Gray-2 p-4 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <span className="subhead_4_1 text-Gray-7">투표</span>
                        </div>

                        {/* 항목 입력 */}
                        <div className="flex flex-col gap-3">
                          {voteItems.map((v, index) => (
                            <div
                              key={index}
                              className="w-full rounded-[8px] border border-Subbrown-4 bg-White px-5 py-5"
                            >
                              <input
                                value={v}
                                onChange={(e) =>
                                  handleVoteItemChange(index, e.target.value)
                                }
                                placeholder={`투표 항목 ${index + 1} 입력`}
                                className="w-full bg-transparent outline-none text-Gray-7 body_1_2 placeholder:text-Gray-3"
                              />
                            </div>
                          ))}

                          {/* ✅ 항목 추가: 스샷처럼 한 줄 박스 */}
                          {voteItems.length < 6 && (
                            <button
                              type="button"
                              onClick={addVoteItem}
                              className="
                                w-full h-[56px]
                                rounded-[8px]
                                border border-Subbrown-4
                                bg-White
                                flex items-center justify-center
                                gap-2
                                body_1_2 text-Gray-6
                                hover:text-Gray-7
                              "
                            >
                              <span className="text-[18px] leading-none">＋</span>
                              항목 추가
                            </button>
                          )}
                        </div>

                        {/* 옵션 */}
                        <div className="flex flex-col gap-4">
                          <button
                            type="button"
                            className="flex items-center gap-3 text-left"
                            onClick={() => setIsMultiple((prev) => !prev)}
                          >
                            <div className="relative w-6 h-6 rounded-full border border-Subbrown-3 bg-White">
                              {isMultiple && (
                                <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-2" />
                              )}
                            </div>
                            <span className="body_1_2 text-Gray-7">
                              복수선택
                            </span>
                          </button>

                          <button
                            type="button"
                            className="flex items-center gap-3 text-left"
                            onClick={() => setIsAnonymous((prev) => !prev)}
                          >
                            <div className="relative w-6 h-6 rounded-full border border-Subbrown-3 bg-White">
                              {isAnonymous && (
                                <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-2" />
                              )}
                            </div>
                            <span className="body_1_2 text-Gray-7">
                              익명선택
                            </span>
                          </button>


                          <div className="flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setIsDeadlineEditing(true);
                                requestAnimationFrame(() => {
                                  dateInputRef.current?.showPicker?.();
                                  dateInputRef.current?.focus();
                                });
                              }}
                              className="flex items-center gap-3 text-left"
                            >
                              <div className="relative w-6 h-6">
                                <Image
                                  src="/Calendar.svg"
                                  alt="날짜"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <span className="body_1_2 text-Gray-4">
                                {deadlineDate && deadlineTime
                                  ? `${deadlineDate} ${deadlineTime}`
                                  : "마감 날짜/시간"}
                              </span>
                            </button>

                            {isDeadlineEditing && (
                              <div className="flex gap-3 items-center">
                                <input
                                  ref={dateInputRef}
                                  type="date"
                                  value={deadlineDate}
                                  onChange={(e) => {
                                    setDeadlineDate(e.target.value);
                                    requestAnimationFrame(() => {
                                      timeInputRef.current?.showPicker?.();
                                      timeInputRef.current?.focus();
                                    });
                                  }}
                                  className="h-[44px] rounded-[8px] border border-Subbrown-4 bg-White px-4 body_1_2 text-Gray-7 outline-none"
                                />
                                <input
                                  ref={timeInputRef}
                                  type="time"
                                  value={deadlineTime}
                                  onChange={(e) => {
                                    setDeadlineTime(e.target.value);
                                    requestAnimationFrame(() =>
                                      setIsDeadlineEditing(false),
                                    );
                                  }}
                                  className="h-[44px] rounded-[8px] border border-Subbrown-4 bg-White px-4 body_1_2 text-Gray-7 outline-none"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ✅ 이미지 영역: 3번 스샷처럼 + 모바일 작게 + 가로스크롤(스크롤바 숨김) */}
                  {hasImages && (
                    <div className="px-6 pb-4">
                      <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden scrollbar-none">
                        <div className="flex gap-4 w-max">
                          {imagePreviews.map((src, index) => (
                            <div
                              key={index}
                              className="
                                relative shrink-0 rounded-[8px] overflow-hidden bg-Gray-2
                                w-[110px] h-[110px]
                                t:w-[180px] t:h-[180px]
                                d:w-[254px] d:h-[254px]
                              "
                            >
                              <Image
                                src={src}
                                alt={`첨부 이미지 ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60"
                                aria-label="이미지 삭제"
                              >
                                <span className="text-[12px] text-White leading-none">
                                  ×
                                </span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>


                <div className="flex flex-col gap-3 t:flex-row t:items-center t:justify-between px-6 py-4">
                  {/* ✅ 중요여부: 모바일에서는 위 라인 + 오른쪽 정렬 / t 이상은 왼쪽 */}
                  <div className="flex justify-end t:justify-start">
                    <button
                      type="button"
                      onClick={() => setIsPinned((prev) => !prev)}
                      className={`flex items-center gap-2 body_1_2 transition-all ${
                        isPinned ? "text-Gray-7" : "text-Gray-4"
                      }`}
                    >
                      <Image
                        src={isPinned ? "/CheckOn.svg" : "/CheckOff.svg"}
                        alt="중요 여부"
                        width={20}
                        height={20}
                        className={isPinned ? glow : ""}
                      />
                      중요여부
                    </button>
                  </div>

                  {/* ✅ 오른쪽 3개: 항상 오른쪽 정렬 */}
                  <div className="flex items-center justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setIsVoteEnabled((prev) => !prev)}
                      className={`flex items-center gap-2 body_1_2 transition-all ${
                        isVoteEnabled ? "text-Gray-7" : "text-Gray-4"
                      }`}
                    >
                      <Image
                        src="/vote.svg"
                        alt="투표"
                        width={20}
                        height={20}
                        className={`${isVoteEnabled ? "opacity-100" : "opacity-60"} ${
                          isVoteEnabled ? glow : ""
                        }`}
                      />
                      투표 생성
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsBookshelfModalOpen(true)}
                      className={`flex items-center gap-2 body_1_2 transition-all ${
                        isBookshelfActive ? "text-Gray-7" : "text-Gray-4"
                      }`}
                    >
                      <Image
                        src="/bookshelf.svg"
                        alt="책장"
                        width={20}
                        height={20}
                        className={`${isBookshelfActive ? "opacity-100" : "opacity-60"} ${
                          isBookshelfActive ? glow : ""
                        }`}
                      />
                      책장 등록
                    </button>

                    <button
                      type="button"
                      onClick={handleImageFile}
                      className={`flex items-center gap-2 body_1_2 transition-all ${
                        hasImages ? "text-Gray-7" : "text-Gray-4"
                      }`}
                    >
                      <Image
                        src="/image.svg"
                        alt="이미지"
                        width={20}
                        height={20}
                        className={`${hasImages ? "opacity-100" : "opacity-60"} ${
                          hasImages ? glow : ""
                        }`}
                      />
                      이미지 파일
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="flex justify-center">
              <div className="flex w-full max-w-[1040px] justify-end gap-4 mt-2 t:mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex px-4 py-3 w-[132px] h-[44px] justify-center items-center rounded-lg border border-primary-1 text-primary-3 body_1_2 bg-background transition-colors"
                >
                  임시저장
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex px-4 py-3 w-[132px] h-[44px] justify-center items-center rounded-lg bg-primary-2 text-White body_1_2 hover:opacity-90 transition-opacity"
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>

        <BookshelfModal
          isOpen={isBookshelfModalOpen}
          onClose={() => setIsBookshelfModalOpen(false)}
          onSelect={handleBookSelect}
        />
      </div>
    </div>
  );
}