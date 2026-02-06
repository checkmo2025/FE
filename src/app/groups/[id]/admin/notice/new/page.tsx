'use client';

import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import BookshelfModal from '@/components/base-ui/Group/BookshelfModal';
import BookDetailCard from '@/components/base-ui/Bookcase/BookDetailCard';

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
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedOption, setSelectedOption] =
    useState<'vote' | 'bookshelf' | 'image' | null>(null);
  const [voteItems, setVoteItems] = useState<string[]>(['', '', '', '']);
  const [isMultiple, setIsMultiple] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [voteDate, setVoteDate] = useState('');
  const [isBookshelfModalOpen, setIsBookshelfModalOpen] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = () => {
    const trimmedVoteItems =
      selectedOption === 'vote'
        ? voteItems
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
        : [];

    // TODO: 실제 저장 로직 구현
    console.log('공지사항 저장:', {
      title,
      content,
      selectedOption,
      voteItems: trimmedVoteItems,
      voteSettings:
        selectedOption === 'vote'
          ? {
              isMultiple,
              isAnonymous,
              isImportant,
              voteDate,
            }
          : null,
    });
    router.push(`/groups/${groupId}/admin/notice`);
  };

  const handleCreateVote = () => {
    setSelectedOption(selectedOption === 'vote' ? null : 'vote');
    // TODO: 투표 생성 페이지로 이동 또는 모달 열기
    console.log('투표 생성');
  };

  const handleVoteItemChange = (index: number, value: string) => {
    setVoteItems((prev) =>
      prev.map((item, i) => (i === index ? value : item)),
    );
  };

  const handleRegisterBookshelf = () => {
    const nextSelected =
      selectedOption === 'bookshelf' ? null : 'bookshelf';
    setSelectedOption(nextSelected);
    setIsBookshelfModalOpen(nextSelected === 'bookshelf');
    console.log('책장 등록');
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setSelectedOption('bookshelf');
  };

  const handleImageFile = () => {
    setSelectedOption('image');
    imageInputRef.current?.click();
    console.log('이미지 파일');
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    // 이전에 선택한 이미지들에 새로 선택한 이미지들을 추가
    setImagePreviews((prev) => [...prev, ...urls]);
  };

  // 생성한 object URL 정리
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);
  return (
    <div className="w-full">
      <div className="py-6 px-2.5 t:px-10">
        {/* 제목 및 내용 입력 영역 */}
        <div className="flex justify-center">
          <div className="w-full max-w-[1040px]">
            <p className="subhead_4_1 text-Gray-7 mb-4">공지사항 작성</p>
            
            {/* 선택된 책 표시 */}
            {selectedBook && (
              <div className="mb-4 p-4 rounded-[8px] bg-White border border-Subbrown-4">
                <BookDetailCard
                  title={selectedBook.title}
                  author={selectedBook.author}
                  description={selectedBook.description}
                  category={selectedBook.category}
                  rating={selectedBook.rating}
                />
              </div>
            )}

            {/* 입력 박스 */}
            <div className="relative flex w-full h-[760px] p-[16px] flex-col rounded-[8px] border-2 border-Subbrown-4 bg-White">
            {/* 제목 */}
            <div className="flex p-[10px] items-center gap-[10px] border-b border-b-Subbrown-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해주세요"
                className="w-full bg-transparent outline-none text-Gray-7 subhead_3 t:subhead_4_1 placeholder:text-Gray-3"
              />
            </div>

            {/* 내용 */}
            <div className="flex p-[10px] items-start gap-[10px] h-[140px]">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력해주세요"
                rows={4}
                className="w-full resize-none bg-transparent outline-none text-Gray-7 body_1 t:body_1_3 placeholder:text-Gray-3 whitespace-pre-wrap"
              />
            </div>

            {/* 투표 / 이미지 영역 */}
            <div className="mt-0 h-[496px]">
              {selectedOption === 'vote' && (
                <div className="h-full rounded-[8px] bg-background border border-Gray-2 p-4 flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className="w-full rounded-[8px] border border-Subbrown-4 bg-White px-5 py-5"
                      >
                        <input
                          value={voteItems[index]}
                          onChange={(e) =>
                            handleVoteItemChange(index, e.target.value)
                          }
                          placeholder={`투표 항목 ${index + 1} 입력`}
                          className="w-full bg-transparent outline-none text-Gray-7 body_1_2 placeholder:text-Gray-3"
                        />
                      </div>
                    ))}
                  </div>

                  {/* 추가 설정  */}
                  <div className="flex flex-col gap-4">
                    {/* 복수선택 */}
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
                      <span className="body_1_2 text-Gray-7">복수선택</span>
                    </button>

                    {/* 익명선택 */}
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
                      <span className="body_1_2 text-Gray-7">익명선택</span>
                    </button>

                    {/* 중요여부 */}
                    <button
                      type="button"
                      className="flex items-center gap-3 text-left"
                      onClick={() => setIsImportant((prev) => !prev)}
                    >
                      <div className="relative w-6 h-6 rounded-full border border-Subbrown-3 bg-White">
                        {isImportant && (
                          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-2" />
                        )}
                      </div>
                      <span className="body_1_2 text-Gray-7">중요여부</span>
                    </button>

                    {/* 날짜 선택 */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-6 h-6">
                        <Image
                          src="/Calendar.svg"
                          alt="날짜"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="body_1_2 text-Gray-4">날짜선택</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedOption === 'image' && (
                <div className="h-full flex items-end">
                  {imagePreviews.length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden scrollbar-none">
                      {imagePreviews.map((src, index) => (
                        <div
                          key={index}
                          className="relative w-[254px] h-[254px] shrink-0 rounded-[8px] overflow-hidden bg-Gray-2"
                        >
                          <Image
                            src={src}
                            alt={`첨부 이미지 ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          {/* 이미지 삭제 */}
                          <button
                            type="button"
                            onClick={() => {
                              const urlToRemove = imagePreviews[index];
                              URL.revokeObjectURL(urlToRemove);
                              setImagePreviews((prev) =>
                                prev.filter((_, i) => i !== index),
                              );
                            }}
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
                  ) : null}
                </div>
              )}
            </div>
            
            <div className="mt-auto pt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCreateVote}
                className={`flex items-center gap-2 body_1_2 transition-colors ${
                  selectedOption === 'vote'
                    ? 'text-Gray-7'
                    : 'text-Gray-4'
                }`}
              >
                <Image 
                  src="/vote.svg" 
                  alt="투표" 
                  width={20} 
                  height={20}
                  className={selectedOption === 'vote' ? 'opacity-100' : 'opacity-40'}
                />
                투표 생성
              </button>
              <button
                type="button"
                onClick={handleRegisterBookshelf}
                className={`flex items-center gap-2 body_1_2 transition-colors ${
                  selectedOption === 'bookshelf'
                    ? 'text-Gray-7'
                    : 'text-Gray-4'
                }`}
              >
                <Image 
                  src="/bookshelf.svg" 
                  alt="책장" 
                  width={20} 
                  height={20}
                  className={selectedOption === 'bookshelf' ? 'opacity-100' : 'opacity-60'}
                />
                책장 등록
              </button>
              <button
                type="button"
                onClick={handleImageFile}
                className={`flex items-center gap-2 body_1_2 transition-colors ${
                  selectedOption === 'image'
                    ? 'text-Gray-7'
                    : 'text-Gray-4'
                }`}
              >
                <Image 
                  src="/image.svg" 
                  alt="이미지" 
                  width={20} 
                  height={20}
                  className={selectedOption === 'image' ? 'opacity-100' : 'opacity-60'}
                />
                이미지 파일
              </button>
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
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center">
          <div className="flex w-full max-w-[1040px] justify-center t:justify-end gap-4 mt-6">
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

      {/* 책장 등록 모달 */}
      <BookshelfModal
        isOpen={isBookshelfModalOpen}
        onClose={() => {
          setIsBookshelfModalOpen(false);
          setSelectedOption((prev) =>
            prev === 'bookshelf' ? null : prev,
          );
        }}
        onSelect={handleBookSelect}
      />
    </div>
  );
}
