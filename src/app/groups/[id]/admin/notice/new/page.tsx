"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import BookshelfModal from "@/components/base-ui/Group/BookshelfModal";
import BookDetailCard from "@/components/base-ui/Bookcase/BookDetailCard";
import { useHeaderTitle } from "@/contexts/HeaderTitleContext";
import { CreateClubNoticeRequest, CreateClubNoticeVote } from "@/types/clubnotification";
import toast from "react-hot-toast";

import { useClubsBookshelfSimpleInfiniteQuery } from "@/hooks/queries/useClubsBookshelfQueries";
import { imageService } from "@/services/imageService";
import { useCreateClubNoticeMutation } from "@/hooks/mutations/useClubNotificationMutations";

type Book = {
  id: number; // meetingId로 사용
  title: string;
  author: string;
  category: { generation: string; genre: string };
  rating: number;
  description: string;
  imageUrl?: string | null;
};

export default function NewNoticePage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  const clubId = Number(groupId);
  const { setCustomTitle } = useHeaderTitle();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isVoteEnabled, setIsVoteEnabled] = useState(false);
  const [isImageEnabled, setIsImageEnabled] = useState(false);

  const [isPinned, setIsPinned] = useState(false);

  const [voteItems, setVoteItems] = useState<string[]>(["", ""]);
  const [isMultiple, setIsMultiple] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const [isDeadlineEditing, setIsDeadlineEditing] = useState(false);
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const timeInputRef = useRef<HTMLInputElement | null>(null);

  const [isBookshelfModalOpen, setIsBookshelfModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const hasImages = imagePreviews.length > 0;

  const shelvesQuery = useClubsBookshelfSimpleInfiniteQuery(clubId, {
    enabled: Number.isFinite(clubId) && isBookshelfModalOpen,
  });

  const shelves =
  shelvesQuery.data?.pages.flatMap((p: any) => p.bookShelfInfoList) ?? [];

  const modalBooks: Book[] = useMemo(() => {
    return shelves.map((s: any) => ({
      id: s.meetingInfo.meetingId,
      title: s.bookInfo.title,
      author: s.bookInfo.author,
      category: {
        generation: `${s.meetingInfo.generation}기`,
        genre: s.meetingInfo.tag,
      },
      rating: s.meetingInfo.averageRate ?? 0,
      description: "",
      imageUrl: s.bookInfo.imgUrl ?? null, 
    }));
  }, [shelves]);

  const { mutateAsync: createNotice, isPending } = useCreateClubNoticeMutation();

  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const adjustContentHeight = () => {
    const ta = contentRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  };

  useEffect(() => {
    setCustomTitle("공지사항 작성");
    return () => setCustomTitle(null);
  }, [setCustomTitle]);

  useEffect(() => {
    adjustContentHeight();
  }, [content]);

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
    setVoteItems((prev) => (prev.length >= 6 ? prev : [...prev, ""]));
  };

  const handleImageFile = () => {
    setIsImageEnabled(true);
    imageInputRef.current?.click();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArr = Array.from(files);
    const urls = fileArr.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...fileArr]);
    setImagePreviews((prev) => [...prev, ...urls]);

    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const url = imagePreviews[index];
    if (url) URL.revokeObjectURL(url);

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

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

  const handleSubmit = async () => {
    if (!Number.isFinite(clubId)) {
      toast.error("clubId가 올바르지 않습니다.");
      return;
    }
    if (isPending) return;

    const now = new Date();
    const nowISO = now.toISOString();

    //  deadline 미설정이면 막기
    if (isVoteEnabled && !voteDeadlineISO) {
      toast.error("마감시간을 설정하지 않았습니다.");
      return;
    }

    // deadline이 startTime(=now)보다 앞서면 막기
    if (isVoteEnabled && voteDeadlineISO) {
      const deadline = new Date(voteDeadlineISO);
      if (deadline.getTime() <= now.getTime()) {
        toast.error("마감시간이 현재시간보다 앞설 수 없습니다.");
        return;
      }
    }
    if (content.length > 1000) {
      toast.error("공지사항은 1000자 이내로 작성 가능합니다.");
      return;
    }
    // inned 5개 제한 “사전 차단”은 pinned 개수를 알아야 가능
    const tid = toast.loading("공지사항 등록 중...");

    try {
      const uploadedImageUrls =
        isImageEnabled && imageFiles.length > 0
          ? await Promise.all(imageFiles.map((f) => imageService.uploadClubImage(f)))
          : [];

      const vote: CreateClubNoticeVote | undefined = isVoteEnabled
        ? {
            title: "투표 DUMMY값",
            content: "투표 DUMMY값",
            ...mapVoteItemsToRequest(voteItems),
            anonymity: isAnonymous,
            duplication: isMultiple,
            startTime: nowISO,
            deadline: voteDeadlineISO!, // 위에서 체크함
          }
        : undefined;


      const body: CreateClubNoticeRequest = {
        title,
        content,
        imageUrls: uploadedImageUrls, 
        isPinned,
        ...(selectedBook ? { meetingId: selectedBook.id } : {}), 
        ...(vote ? { vote } : {}),
      };

      await createNotice({ clubId, body });

      toast.dismiss(tid);
      toast.success("공지사항 등록 성공");
      router.push(`/groups/${groupId}/notice`);
    } catch (e: any) {
      toast.dismiss(tid);

      const msg = e?.message ?? "";
      if (msg.includes("isPinned") || msg.includes("pinned") || msg.includes("고정")) {
        toast.error("고정 공지는 최대 5개까지 가능합니다.");
        return;
      }

      toast.error("공지사항 등록 실패");
    }
  };

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
                  imageUrl={selectedBook.imageUrl ?? "/dummy_book_cover.png"}
                  title={selectedBook.title}
                  author={selectedBook.author}
                  description={selectedBook.description}
                  category={selectedBook.category}
                  rating={selectedBook.rating}
                />
              </div>
            )}

            {/* 이하 UI는 그대로 */}
            <div className="relative w-full border border-Subbrown-4 t:border-2 bg-White rounded-[8px]">
              <div className="flex flex-col min-h-[300px] t:min-h-[500px]">
                <div className="flex-1 overflow-auto">
                  <div className="flex px-6 py-4 items-center border-b border-b-Subbrown-4">
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="제목을 입력해주세요."
                      className="w-full bg-transparent outline-none text-Gray-7 subhead_4_1 placeholder:text-Gray-3"
                    />
                  </div>

                 <div className="px-6 py-4">
                  <textarea
                    ref={contentRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value.slice(0, 1000))}
                    onInput={adjustContentHeight}
                    placeholder="내용을 입력해주세요"
                    rows={1}
                    maxLength={1000}
                    className="
                      w-full min-w-0 resize-none bg-transparent outline-none
                      overflow-hidden
                      text-Gray-7 body_1_3 placeholder:text-Gray-3
                      whitespace-pre-wrap
                    "
                  />

                  <div className="mt-2 flex justify-end">
                    <span className="text-[12px] leading-[16px] text-Gray-3">
                      {content.length}/1000
                    </span>
                  </div>
                </div>

                  {isVoteEnabled && (
                    <div className="px-6 pb-4">
                      <div className="rounded-[8px] bg-background border border-Gray-2 p-4 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <span className="subhead_4_1 text-Gray-7">투표</span>
                        </div>

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

                  {hasImages && (
                    <div className="px-6 pb-4">
                      <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden scrollbar-none">
                        <div className="flex gap-4 min-w-full w-max">
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

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <div className="flex w-full max-w-[1040px] justify-end gap-4 mt-2 t:mt-6">
                <button
                  type="button"
                  onClick={() => toast("임시저장은 미구현입니다.")}
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
          books={modalBooks}
          hasNextPage={shelvesQuery.hasNextPage}
          isFetchingNextPage={shelvesQuery.isFetchingNextPage}
          onLoadMore={() => {
            if (shelvesQuery.hasNextPage && !shelvesQuery.isFetchingNextPage) {
              shelvesQuery.fetchNextPage();
            }
          }}
        />
      </div>
    </div>
  );
}