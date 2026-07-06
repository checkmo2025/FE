'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';

import BookSelectModal from '@/components/layout/BookSelectModal';
import BookstoryChoosebook from '@/components/base-ui/BookStory/Editor/bookstory_choosebook';
import { useBookDetailQuery } from '@/hooks/queries/useBookQueries';
import { useHeaderTitle } from '@/contexts/HeaderTitleContext';
import { useCreateBookshelfMutation } from '@/hooks/mutations/useClubsBookshelfMutations';
import { CreateBookshelfRequest } from '@/types/bookshelf';
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard';
import { INPUT_LIMITS } from '@/constants/inputLimits';
import { clampTextToLimit, isTextOverLimit } from '@/utils/inputLimit';

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

const getBookshelfErrorMessage = (error: unknown, fallback: string) => {
  const apiMessage =
    typeof error === 'object' && error !== null && 'response' in error
      ? (error as { response?: { data?: { message?: unknown } } }).response?.data?.message
      : undefined;

  if (typeof apiMessage === 'string' && apiMessage) return apiMessage;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

function meetingDateToISO(dateInput: string) {
  if (!dateInput.trim()) return null;

  const m = dateInput.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;

  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);

  // 실제 존재하는 날짜인지 UTC 기준으로 검증(예: 2026-02-31 차단).
  // 로컬 Date로 검증하면 시간대 보정으로 잘못된 날짜가 통과할 수 있다.
  const dt = new Date(Date.UTC(y, mo, d));
  if (Number.isNaN(dt.getTime())) return null;
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo || dt.getUTCDate() !== d) return null;

  // meetingTime은 백엔드에서 LocalDateTime(시간대 없음)으로 다루는 날짜 값이다.
  // toISOString()으로 'Z'(UTC)를 붙여 보내면 시간대 차이로 날짜가 하루 밀릴 수 있으므로,
  // 시간대 변환 없이 로컬 자정 ISO 문자열을 그대로 전송한다.
  return `${m[1]}-${m[2]}-${m[3]}T00:00:00`;
}

function formatDateInputLabel(dateInput: string) {
  const m = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return '날짜를 선택해주세요';

  return `${m[1]}.${m[2]}.${m[3]}`;
}

export default function NewBookshelfPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  const { setCustomTitle } = useHeaderTitle();

  const [selectedIsbn, setSelectedIsbn] = useState<string>('');
  const { data: selectedBook } = useBookDetailQuery(selectedIsbn);

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
  const isDirty = Boolean(
    selectedIsbn ||
      generation !== '1' ||
      selectedTags.length > 0 ||
      meetingName.trim() ||
      meetingLocation.trim() ||
      meetingDate.trim()
  );
  const { confirmNavigation, runWithoutGuard } = useUnsavedChangesGuard({
    isDirty,
    variant: 'create',
    title: '작성 중인 책장 정보가 있어요',
    description: '이 화면을 나가면 입력한 책장 정보가 저장되지 않습니다.',
  });

  // ✅ 버튼 막기 조건
  const selectedTagIndex = selectedTags[0];
  const tagString = selectedTagIndex !== undefined ? TAG_LABELS[selectedTagIndex] : '';
  const meetingTimeISO = meetingDateToISO(meetingDate);
  const isMeetingDateValid = meetingDate.trim().length === 0 || !!meetingTimeISO;

  const canSubmit =
    !!selectedBook &&
    !!tagString &&
    isMeetingDateValid;

  const handleCancel = () => {
    confirmNavigation(() => router.back());
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error('필수 입력값을 확인해 주세요.');
      return;
    }
    if (!selectedBook) return;
    if (
      isTextOverLimit(
        meetingName,
        INPUT_LIMITS.BOOKSHELF_MEETING_TITLE,
        `정기모임 이름은 ${INPUT_LIMITS.BOOKSHELF_MEETING_TITLE}자 이하여야 합니다.`
      ) ||
      isTextOverLimit(
        meetingLocation,
        INPUT_LIMITS.BOOKSHELF_MEETING_LOCATION,
        `모임 장소는 ${INPUT_LIMITS.BOOKSHELF_MEETING_LOCATION}자 이하여야 합니다.`
      )
    ) {
      return;
    }

    const body: CreateBookshelfRequest = {
      title: meetingName.trim(),
      meetingTime: meetingTimeISO,
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
      runWithoutGuard(() => router.push(`/groups/${groupId}/bookcase`));
    } catch (e: unknown) {
      console.error(e);
      toast.error(getBookshelfErrorMessage(e, '책장 생성에 실패했습니다.'));
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
    confirmNavigation(() => router.back());
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
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          setGeneration(num.toString());
                          setIsGenerationOpen(false);
                        }}
                        className={`w-22 h-8 px-3 text-left subhead_4_1 cursor-pointer ${generation === num.toString()
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
                      className={`h-10 px-4 py-1 rounded-[8px] body_2_2 cursor-pointer transition-colors ${isSelected
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
              <label className="subhead_4_1 text-Gray-7">정기모임 이름 (선택)</label>
              <input
                type="text"
                value={meetingName}
                onChange={(e) =>
                  setMeetingName(
                    clampTextToLimit(
                      e.target.value,
                      INPUT_LIMITS.BOOKSHELF_MEETING_TITLE,
                      `정기모임 이름은 ${INPUT_LIMITS.BOOKSHELF_MEETING_TITLE}자 이하여야 합니다.`
                    )
                  )
                }
                placeholder={`정기모임 이름을 입력해주세요 (최대 ${INPUT_LIMITS.BOOKSHELF_MEETING_TITLE}자)`}
                className="px-4 py-3 h-14 rounded-[8px] border border-Subbrown-4 bg-White text-Gray-7 body_1_3 placeholder:text-Gray-3"
              />
            </div>

            {/* 모임 장소 */}
            <div className="flex flex-col gap-2 t:pt-5">
              <label className="subhead_4_1 text-Gray-7">모임 장소 (선택)</label>
              <input
                type="text"
                value={meetingLocation}
                onChange={(e) =>
                  setMeetingLocation(
                    clampTextToLimit(
                      e.target.value,
                      INPUT_LIMITS.BOOKSHELF_MEETING_LOCATION,
                      `모임 장소는 ${INPUT_LIMITS.BOOKSHELF_MEETING_LOCATION}자 이하여야 합니다.`
                    )
                  )
                }
                placeholder={`모임 장소를 입력해주세요 (최대 ${INPUT_LIMITS.BOOKSHELF_MEETING_LOCATION}자)`}
                className="px-4 py-3 h-14 rounded-[8px] border border-Subbrown-4 bg-White text-Gray-7 body_1_3 placeholder:text-Gray-3"
              />
            </div>

            {/* 모임 날짜 */}
            <div className="flex flex-col gap-2 t:pt-5">
              <label className="subhead_4_1 text-Gray-7">모임 날짜 (선택)</label>
              <div className="relative h-14">
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  onClick={(e) => e.currentTarget.showPicker?.()}
                  aria-label="모임 날짜 선택"
                  className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none flex h-14 w-full items-center justify-between rounded-[8px] border border-Subbrown-4 bg-White px-4 py-3 transition-colors peer-focus:border-primary-2"
                >
                  <span className={`body_1_3 ${meetingDate ? 'text-Gray-7' : 'text-Gray-3'}`}>
                    {formatDateInputLabel(meetingDate)}
                  </span>
                  <Image
                    src="/Calendar.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="object-contain opacity-80"
                  />
                </div>
              </div>
              <p className="text-Gray-4 body_2_2">선택하지 않으면 날짜 없이 등록됩니다.</p>
            </div>

            {/* 하단 버튼 */}
            <div className="flex justify-center t:justify-end gap-2 ">
              <button
                type="button"
                onClick={handleCancel}
                className="flex px-4 py-3 w-[132px] h-[44px] justify-center items-center rounded-lg border border-primary-1 text-primary-3 body_1_2 bg-background transition-colors hover:bg-Subbrown-3"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit || createBookshelfMutation.isPending}
                className={`flex px-4 py-3 w-[132px] h-[44px] justify-center items-center rounded-lg body_1_2 transition-colors ${!canSubmit || createBookshelfMutation.isPending
                    ? 'bg-Subbrown-4 text-Gray-4 cursor-not-allowed opacity-70'
                    : 'bg-primary-2 text-White hover:bg-primary-1'
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
