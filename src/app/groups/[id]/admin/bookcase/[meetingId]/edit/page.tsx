/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';

import BookSelectModal from '@/components/layout/BookSelectModal';
import BookstoryChoosebook from '@/components/base-ui/BookStory/Editor/bookstory_choosebook';
import { useHeaderTitle } from '@/contexts/HeaderTitleContext';


// 타입
import { BookshelfPatchRequest } from '@/types/bookshelf';
import { useBookshelfEditQuery } from '@/hooks/queries/useClubsBookshelfQueries';
import { usePatchBookshelfMutation } from '@/hooks/mutations/useClubsBookshelfMutations';

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

  if (digits.length <= 4) return y;
  if (digits.length <= 6) return `${y}.${m}`;
  return `${y}.${m}.${d}`;
}

function meetingDateToISO(dateDot: string) {
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
  const m = dateDot.trim().match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
  if (!m) return null;

  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);

  const dt = new Date(y, mo, d, 0, 0, 0, 0);
  if (Number.isNaN(dt.getTime())) return null;

  if (dt.getFullYear() !== y || dt.getMonth() !== mo || dt.getDate() !== d) return null;

  return dt;
}

function isBeforeTodayLocal(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
}

// ✅ ISO -> "YYYY.MM.DD" (edit에서 초기값 채우기용)
function isoToDateDot(iso: string) {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return '';
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

export default function EditBookshelfPage() {
  const params = useParams();
  const router = useRouter();
  const clubId = Number(params.id as string);
  const meetingId = Number(params.meetingId as string);
  const { setCustomTitle } = useHeaderTitle();

  const [meetingDateError, setMeetingDateError] = useState<string>('');

  // 모바일 헤더 타이틀 설정
  useEffect(() => {
    setCustomTitle('책장 수정');
    return () => setCustomTitle(null);
  }, [setCustomTitle]);


  const { data: editData, isLoading } = useBookshelfEditQuery(clubId, meetingId);
  const patchMutation = usePatchBookshelfMutation(clubId, meetingId);

  const selectedBook = editData?.bookDetailInfo;

  const [generation, setGeneration] = useState('1');
  const [isGenerationOpen, setIsGenerationOpen] = useState(false);

  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const [meetingName, setMeetingName] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [isBookSelectModalOpen, setIsBookSelectModalOpen] = useState(false);

  // ✅ GET 결과로 초기값 채우기 (UI 변경 없음, state만 채움)
  useEffect(() => {
    if (!editData) return;

    const { meetingInfo } = editData;

    setMeetingName(meetingInfo.title ?? '');
    setMeetingLocation(meetingInfo.location ?? '');
    setGeneration(String(meetingInfo.generation ?? 1));

    const tag = (meetingInfo.tag ?? "") as (typeof TAG_LABELS)[number] | "";
    const idx = TAG_LABELS.indexOf(tag as (typeof TAG_LABELS)[number]);
    setSelectedTags(idx >= 0 ? [idx] : []);

    // meetingTime ISO -> YYYY.MM.DD
    setMeetingDate(isoToDateDot(meetingInfo.meetingTime ?? ''));

    // edit 초기값 세팅 시 에러 초기화
    setMeetingDateError('');
  }, [editData]);

  // ✅ 버튼 막기 조건 (기존 로직 유지)
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

    // ✅ PATCH payload는 이것만
    const body: BookshelfPatchRequest = {
      title: meetingName.trim(),
      meetingTime: meetingTimeISO as string,
      location: meetingLocation.trim(),
      generation: Number(generation),
      tag: tagString,
    };

    try {
      await patchMutation.mutateAsync({
        clubId,
        meetingId,
        body,
      });

      toast.success('책장 수정 완료!');
      router.push(`/groups/${clubId}/bookcase`);
    } catch (e: any) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        '책장 수정에 실패했습니다.';
      toast.error(msg);
    }
  };

  const handleTagToggle = (index: number) => {
    setSelectedTags((prev) => {
      if (prev[0] === index) return [];
      return [index];
    });
  };

  // ✅ 책 수정 불가: 선택 모달 열기/선택 함수는 "막기"
  const handleBookSelect = (_selectedIsbn: string) => {
    // 요구사항: 책은 수정 불가
    toast.error('책은 수정할 수 없습니다.');
    setIsBookSelectModalOpen(false);
  };

  const handleBack = () => {
    router.back();
  };

  // 로딩 처리(최소)
  if (isLoading) {
    return <div className="w-full px-4 py-6 text-Gray-7 body_1_3">로딩중...</div>;
  }

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
            <p className="subhead_3 text-Gray-7">책장 수정</p>

            {/* 책 선택 */}
            <div className="flex flex-col gap-2">
              <label className="subhead_4_1 text-Gray-7">
                책 선택<span className="text-[#FF5151]">*</span>
              </label>

              {selectedBook ? (
                // ✅ UI 유지: BookstoryChoosebook 그대로
                // ✅ 단, 클릭해도 모달 안 열리게(요구사항)
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toast.error('책은 수정할 수 없습니다.')}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") toast.error('책은 수정할 수 없습니다.');
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
                // edit인데 book이 없다면 이상한 상태. UI는 유지하되 버튼은 비활성처럼 처리
                <button
                  type="button"
                  onClick={() => toast.error('책 정보를 불러오지 못했습니다.')}
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
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
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

                    const digits = next.replace(/\D/g, '');
                    if (digits.length < 8) {
                      setMeetingDateError('');
                      return;
                    }

                    const dt = parseDateDotToLocalDate(next);
                    if (!dt) {
                      setMeetingDateError('날짜 형식이 아니거나 현재날짜보다 작습니다.');
                      return;
                    }

                    if (isBeforeTodayLocal(dt)) {
                      setMeetingDateError('날짜 형식이 아니거나 현재날짜보다 작습니다.');
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
                disabled={!canSubmit || patchMutation.isPending}
                className={`flex px-4 py-3 w-[132px] h-[44px] justify-center items-center rounded-lg body_1_2 transition-opacity ${!canSubmit || patchMutation.isPending
                    ? 'bg-Subbrown-4 text-Gray-4 cursor-not-allowed opacity-70'
                    : 'bg-primary-2 text-White hover:opacity-90'
                  }`}
              >
                수정
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
