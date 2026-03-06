'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';

import BookSelectModal from '@/components/layout/BookSelectModal';
import BookstoryChoosebook from '@/components/base-ui/BookStory/bookstory_choosebook';
import { useBookDetailQuery } from '@/hooks/queries/useBookQueries';
import { useHeaderTitle } from '@/contexts/HeaderTitleContext';
import { useCreateBookshelfMutation } from '@/hooks/mutations/useClubsBookshelfMutations';
import { CreateBookshelfRequest } from '@/types/bookshelf';

const TAGS = [
  { label: '여행', colorClass: 'bg-Secondary-2' },
  { label: '외국어', colorClass: 'bg-Secondary-2' },
  { label: '어린이/청소년', colorClass: 'bg-Secondary-2' },
  { label: '종교/철학', colorClass: 'bg-Secondary-2' },
  { label: '인문학', colorClass: 'bg-Secondary-1' },
  { label: '에세이', colorClass: 'bg-Secondary-1' },
  { label: '소설/시/희곡', colorClass: 'bg-Secondary-1' },
  { label: '과학', colorClass: 'bg-Secondary-3' },
  { label: '컴퓨터/IT', colorClass: 'bg-Secondary-3' },
  { label: '경제/경영', colorClass: 'bg-Secondary-3' },
  { label: '자기계발', colorClass: 'bg-Secondary-3' },
  { label: '사회과학', colorClass: 'bg-Secondary-4' },
  { label: '정치/외교/국방', colorClass: 'bg-Secondary-4' },
  { label: '역사/문화', colorClass: 'bg-Secondary-4' },
  { label: '예술/대중문화', colorClass: 'bg-Secondary-4' },
] as const;

const TAG_LABELS = TAGS.map((tag) => tag.label);

const getTagBgColor = (index: number) => {
  return TAGS[index]?.colorClass ?? 'bg-Subbrown-4';
};

// ✅ 날짜 입력: 뒤로가기/삭제 가능하게 "숫자만" 기반으로 포맷
function formatMeetingDateLoose(input: string) {
  const digits = input.replace(/\D/g, '').slice(0, 8);
  const y = digits.slice(0, 4);
  const m = digits.slice(4, 6);
  const d = digits.slice(6, 8);

  // 강제적으로 '.' 찍지 말고, 있는 만큼만 자연스럽게 보여준다.
  if (digits.length <= 4) return y;
  if (digits.length <= 6) return `${y}.${m}`;
  return `${y}.${m}.${d}`;
}

function meetingDateToISO(dateDot: string) {
  // "YYYY.MM.DD" -> ISO
  const m = dateDot.trim().match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
  if (!m) return null;

  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);

  const dt = new Date(y, mo, d, 0, 0, 0);
  if (Number.isNaN(dt.getTime())) return null;
  return dt.toISOString();
}

function parseDateDotToLocalDate(dateDot: string) {
  // "YYYY.MM.DD" only
  const m = dateDot.trim().match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
  if (!m) return null;

  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);

  const dt = new Date(y, mo, d, 0, 0, 0, 0); // local midnight
  if (Number.isNaN(dt.getTime())) return null;

  // 날짜가 실제로 존재하는지(예: 2026.02.31 방지)
  if (dt.getFullYear() !== y || dt.getMonth() !== mo || dt.getDate() !== d) return null;

  return dt;
}

function isBeforeTodayLocal(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
}

export default function NewBookshelfPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  const { setCustomTitle } = useHeaderTitle();

  const [selectedIsbn, setSelectedIsbn] = useState<string>('');
  const { data: selectedBook } = useBookDetailQuery(selectedIsbn);

  const [meetingDateError, setMeetingDateError] = useState<string>('');

  // 모바일 헤더 타이틀 설정
  useEffect(() => {
    setCustomTitle('책장 작성');
    return () => setCustomTitle(null);
  }, [setCustomTitle]);

  const [generation, setGeneration] = useState('1');
  const [isGenerationOpen, setIsGenerationOpen] = useState(false);

  // ✅ 태그는 1개만
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const [meetingName, setMeetingName] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [isBookSelectModalOpen, setIsBookSelectModalOpen] = useState(false);

  const createBookshelfMutation = useCreateBookshelfMutation();

  // ✅ 버튼 막기 조건
  const selectedTagIndex = selectedTags[0];
  const tagString = selectedTagIndex !== undefined ? TAG_LABELS[selectedTagIndex] : '';
  const meetingTimeISO = meetingDateToISO(meetingDate);

  const canSubmit =
    !!selectedBook &&
    meetingName.trim().length > 0 &&
    meetingLocation.trim().length > 0 &&
    !!tagString &&
    !!meetingTimeISO &&
    !meetingDateError;

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error('필수 입력값을 확인해 주세요.');
      return;
    }
    if (!selectedBook) return;

    // meetingTimeISO는 canSubmit에서 이미 보장
    const body: CreateBookshelfRequest = {
      title: meetingName.trim(),
      meetingTime: meetingTimeISO as string,
      location: meetingLocation.trim(),
      generation: Number(generation),
      tag: tagString,
      isbn: selectedBook.isbn,
    };

    try {
      await createBookshelfMutation.mutateAsync({
        clubId: Number(groupId),
        body,
      });

      toast.success('책장 생성 완료!');
      router.push(`/groups/${groupId}/bookcase`);
    } catch (e: any) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        '책장 생성에 실패했습니다.';
      toast.error(msg);
    }
  };

  const handleTagToggle = (index: number) => {
    setSelectedTags((prev) => {
      // 이미 선택한 태그면 해제
      if (prev[0] === index) return [];
      // 다른 거 누르면 기존 선택 제거 후 새로 선택
      return [index];
    });
  };

  const handleBookSelect = (selectedIsbn: string) => {
    setSelectedIsbn(selectedIsbn);
    setIsBookSelectModalOpen(false);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="w-full">
      {/* 뒤로가기 - 모바일에서만 */}
      <div className="t:hidden px-2.5 py-3">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-Gray-7 body_1_2"
        >
          <Image src="/back.svg" alt="뒤로가기" width={12} height={12} />
          <span>뒤로가기</span>
        </button>
      </div>
      <div className="t:hidden border-b border-Gray-2" />

      <div className="py-4 t:py-6 px-2.5 t:px-10">
        <div className="flex justify-center">
          <div className="w-full max-w-[1040px] flex flex-col gap-6">
            <p className="subhead_3 text-Gray-7">책장 작성</p>

            {/* 책 선택 */}
            <div className="flex flex-col gap-2">
              <label className="subhead_4_1 text-Gray-7">
                책 선택<span className="text-[#FF5151]">*</span>
              </label>
              {selectedBook ? (
              <div
                role="button"
                tabIndex={0}
                onClick={() => setIsBookSelectModalOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setIsBookSelectModalOpen(true);
                }}
                className="cursor-pointer"
              >
                <BookstoryChoosebook
                  bookUrl={selectedBook.imgUrl}
                  bookName={selectedBook.title}
                  author={selectedBook.author}
                  bookDetail={selectedBook.description}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsBookSelectModalOpen(true)}
                className="w-full px-4 py-3 rounded-[8px] border border-Subbrown-4 bg-White text-Gray-7 subhead_4 d:body_1_2 text-center underline underline-offset-3 cursor-pointer"
              >
                선택하기
              </button>
            )}
            </div>

            {/* 기수 */}
            <div className="flex flex-col gap-2 pt-5">
              <label className="subhead_4_1 text-Gray-7">
                기수<span className="text-[#FF5151]">*</span>
              </label>
              <div className="relative w-20">
                <button
                  type="button"
                  onClick={() => setIsGenerationOpen((prev) => !prev)}
                  className="w-25 px-4 py-3 pr-3 rounded-[8px] border border-Subbrown-4 bg-White text-Gray-7 subhead_4_1 flex items-center justify-between cursor-pointer"
                >
                  <span>{generation}</span>
                  <Image
                    src="/ArrowDown.svg"
                    alt="드롭다운"
                    width={20}
                    height={20}
                    className="shrink-0"
                  />
                </button>
                {isGenerationOpen && (
                  <div className="absolute left-0 mt-1 w-full rounded-[8px] border border-Subbrown-4 bg-White shadow-lg z-10">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          setGeneration(num.toString());
                          setIsGenerationOpen(false);
                        }}
                        className={`w-22 h-8 px-3 text-left subhead_4_1 cursor-pointer ${
                          generation === num.toString()
                            ? 'bg-Subbrown-4 text-Gray-7'
                            : 'bg-White text-Gray-7 hover:bg-Subbrown-4'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 태그 */}
            <div className="flex flex-col gap-2 pt-5">
              <label className="subhead_4_1 text-Gray-7">태그</label>
              <div className="flex flex-wrap gap-3">
                {TAG_LABELS.map((label, index) => {
                  const isSelected = selectedTags.includes(index);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleTagToggle(index)}
                      className={`h-10 px-4 py-1 rounded-[8px] body_2_2 cursor-pointer transition-colors ${
                        isSelected
                          ? `${getTagBgColor(index)} text-White`
                          : 'bg-transparent text-Gray-4 border border-Gray-2'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 정기모임이름 */}
            <div className="flex flex-col gap-2 t:pt-5">
              <label className="subhead_4_1 text-Gray-7">정기모임이름</label>
              <input
                type="text"
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
                placeholder="정기모임 이름을 입력해주세요"
                className="px-4 py-3 h-14 rounded-[8px] border border-Subbrown-4 bg-White text-Gray-7 body_1_3 placeholder:text-Gray-3"
              />
            </div>

            {/* 모임 장소 */}
            <div className="flex flex-col gap-2 t:pt-5">
              <label className="subhead_4_1 text-Gray-7">모임 장소</label>
              <input
                type="text"
                value={meetingLocation}
                onChange={(e) => setMeetingLocation(e.target.value)}
                placeholder="모임 장소를 입력해주세요"
                className="px-4 py-3 h-14 rounded-[8px] border border-Subbrown-4 bg-White text-Gray-7 body_1_3 placeholder:text-Gray-3"
              />
            </div>

            {/* 모임 날짜 */}
            <div className="flex flex-col gap-2 t:pt-5">
              <label className="subhead_4_1 text-Gray-7">모임 날짜</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={meetingDate}
                  onChange={(e) => {
                    const next = formatMeetingDateLoose(e.target.value);
                    setMeetingDate(next);

                    // 8자리(YYYYMMDD) 다 입력된 상태에서만 검사
                    const digits = next.replace(/\D/g, '');
                    if (digits.length < 8) {
                      setMeetingDateError('');
                      return;
                    }

                    const dt = parseDateDotToLocalDate(next);
                    if (!dt) {
                      setMeetingDateError('날짜 형식이 아니거나 현재날짜보다 과거입니다.');
                      return;
                    }

                    if (isBeforeTodayLocal(dt)) {
                      setMeetingDateError('날짜 형식이 아니거나 현재날짜보다 과거입니다.');
                      return;
                    }

                    setMeetingDateError('');
                  }}
                  placeholder="2000.00.00의 양식으로 작성해주세요"
                  className="flex-1 px-4 py-3 h-14 rounded-[8px] border border-Subbrown-4 bg-White text-Gray-7 body_1_3 placeholder:text-Gray-3"
                />
              </div>
              {meetingDateError ? (
                <p className="mt-1 text-[12px] leading-[140%] text-[#FF5151]">
                  {meetingDateError}
                </p>
              ) : null}
            </div>

            {/* 하단 버튼 */}
            <div className="flex justify-center t:justify-end gap-2 ">
              <button
                type="button"
                onClick={handleCancel}
                className="flex px-4 py-3 w-[132px] h-[44px] justify-center items-center rounded-lg border border-primary-1 text-primary-3 body_1_2 bg-background transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit || createBookshelfMutation.isPending}
                className={`flex px-4 py-3 w-[132px] h-[44px] justify-center items-center rounded-lg body_1_2 transition-opacity ${
                  !canSubmit || createBookshelfMutation.isPending
                    ? 'bg-Subbrown-4 text-Gray-4 cursor-not-allowed opacity-70'
                    : 'bg-primary-2 text-White hover:opacity-90'
                }`}
              >
                등록
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 책 선택 모달 */}  
      <BookSelectModal
        isOpen={isBookSelectModalOpen}
        onClose={() => setIsBookSelectModalOpen(false)}
        onSelect={handleBookSelect}
      />
    </div>
  );
}