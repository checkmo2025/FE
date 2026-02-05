'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import BookSelectModal from '@/components/layout/BookSelectModal';
import BookstoryChoosebook from '@/components/base-ui/BookStory/bookstory_choosebook';

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

export default function NewBookshelfPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = params.id as string;
  const bookId = searchParams.get('bookId');

  // 더미 데이터
  const selectedBook = bookId
    ? {
        id: Number(bookId),
        imgUrl: '/booksample.svg',
        title: '어린 왕자',
        author: '김개미, 연수',
        detail: '최대 500(넘어가면...으로)',
      }
    : null;

  const [generation, setGeneration] = useState('1');
  const [isGenerationOpen, setIsGenerationOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [meetingName, setMeetingName] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isBookSelectModalOpen, setIsBookSelectModalOpen] = useState(false);

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = () => {
    // TODO: 실제 저장 로직 구현
    console.log('책장 저장:', {
      book: selectedBook,
      generation,
      tags: selectedTags,
      meetingName,
      meetingLocation,
      meetingDate,
      title,
      content,
    });
    router.push(`/groups/${groupId}/admin/bookcase`);
  };

  const handleTagToggle = (index: number) => {
    setSelectedTags((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index],
    );
  };

  const handleBookSelect = (selectedBookId: number) => {
    router.push(`/groups/${groupId}/admin/bookcase/new?bookId=${selectedBookId}`);
  };

  return (
    <div className="w-full">
      <div className="py-6 px-2.5 t:px-10">
        <div className="flex justify-center">
          <div className="w-full max-w-[1040px] flex flex-col gap-6">
            <p className="subhead_3 text-Gray-7">책장 작성</p>

            {/* 책 선택 */}
            <div className="flex flex-col gap-2">
              <label className="subhead_4_1 text-Gray-7">
                책 선택<span className="text-[#FF5151]">*</span>
              </label>
              {selectedBook ? (
                <BookstoryChoosebook
                  bookUrl={selectedBook.imgUrl}
                  bookName={selectedBook.title}
                  author={selectedBook.author}
                  bookDetail={selectedBook.detail}
                  onButtonClick={() => setIsBookSelectModalOpen(true)}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsBookSelectModalOpen(true)}
                  className="w-full px-4 py-3 rounded-[8px] border border-Subbrown-4 bg-White text-Gray-7 body_1_2 text-center underline cursor-pointer"
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
            <div className="flex flex-col gap-2 pt-5">
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
            <div className="flex flex-col gap-2 pt-5">
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
            <div className="flex flex-col gap-2 pt-5">
              <label className="subhead_4_1 text-Gray-7">모임 날짜</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  placeholder="2000.00.00의 양식으로 작성해주세요"
                  className="flex-1 px-4 py-3 h-14 rounded-[8px] border border-Subbrown-4 bg-White text-Gray-7 body_1_3 placeholder:text-Gray-3"
                />
              </div>
            </div>

            {/* 본문 작성 */}
            <div className="flex flex-col gap-2 pt-5">
              <label className="subhead_4_1 text-Gray-7">본문 작성</label>
              <div className="flex flex-col gap-4 p-4 rounded-[8px] border border-Subbrown-4 bg-White">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력해주세요."
                  className="w-full px-2 py-2 border-b border-Subbrown-4 bg-transparent outline-none text-Gray-7 subhead_3 t:subhead_4_1 placeholder:text-Gray-3"
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="내용을 입력해주세요"
                  rows={8}
                  className="w-full h-119 px-2  resize-none bg-transparent outline-none text-Gray-7 body_1 t:body_1_3 placeholder:text-Gray-3 whitespace-pre-wrap"
                />
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="flex justify-center t:justify-end gap-2 ">
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

      {/* 책 선택 모달 */}
      <BookSelectModal
        isOpen={isBookSelectModalOpen}
        onClose={() => setIsBookSelectModalOpen(false)}
        onSelect={handleBookSelect}
      />
    </div>
  );
}
