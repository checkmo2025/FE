'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useHeaderTitle } from '@/contexts/HeaderTitleContext';

// 더미 데이터
const DUMMY_APPLICANTS = [
  { id: 1, userId: 'hy_0716', name: '윤현일', email: 'yhi9839@naver.com', applyDate: '2000.00.00', message: '저 가입시켜주세요. 저 가입시켜주세요.저 가입시켜주세요.저 가입시켜주세요.저 가입시켜주세요.저 가입시켜주세요.저 가입시켜주세요.저 가입시켜주세요.저 가입시켜주세요.저 가입시켜주세요.저 가입시켜주세요.저 가입시켜주세요.저 가입시켜주세요.저 가입시켜주세요.저 가입시켜주세요.저 가입시켜주세요.저 가입시켜주세요.' },
  { id: 2, userId: 'hy_0716', name: '윤현일', email: 'yhi9839@naver.com', applyDate: '2000.00.00', message: '가입하고 싶습니다!' },
  { id: 3, userId: 'hy_0716', name: '윤현일', email: 'yhi9839@naver.com', applyDate: '2000.00.00', message: '책 모임에 관심이 많습니다.' },
  { id: 4, userId: 'hy_0716', name: '윤현일', email: 'yhi9839@naver.com', applyDate: '2000.00.00', message: '안녕하세요, 가입 신청합니다.' },
  { id: 5, userId: 'hy_0716', name: '윤현일', email: 'yhi9839@naver.com', applyDate: '2000.00.00', message: '열심히 활동하겠습니다!' },
  { id: 6, userId: 'hy_0716', name: '윤현일', email: 'yhi9839@naver.com', applyDate: '2000.00.00', message: '좋은 모임이라 들었습니다.' },
  { id: 7, userId: 'hy_0716', name: '윤현일', email: 'yhi9839@naver.com', applyDate: '2000.00.00', message: '독서를 좋아합니다.' },
  { id: 8, userId: 'hy_0716', name: '윤현일', email: 'yhi9839@naver.com', applyDate: '2000.00.00', message: '가입 부탁드립니다.' },
  { id: 9, userId: 'hy_0716', name: '윤현일', email: 'yhi9839@naver.com', applyDate: '2000.00.00', message: '함께하고 싶습니다.' },
  { id: 10, userId: 'hy_0716', name: '윤현일', email: 'yhi9839@naver.com', applyDate: '2000.00.00', message: '잘 부탁드립니다!' },
];

type ActionType = 'delete' | 'approve';

type ApplicantActionDropdownProps = {
  isOpen: boolean;
  onSelectAction: (action: ActionType) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
};

function ApplicantActionDropdown({ isOpen, onSelectAction, buttonRef }: ApplicantActionDropdownProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.right - 136, // w-34 = 136px
      });
    }
  }, [isOpen, buttonRef]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed w-34 h-22 rounded-lg border border-Subbrown-4 bg-White shadow-md z-50 flex flex-col"
      style={{ top: position.top, left: position.left }}
    >
      <button
        type="button"
        onClick={() => onSelectAction('delete')}
        className="flex-1 w-full flex items-center justify-center gap-2 body_1_2 text-Gray-4 hover:text-Gray-7 cursor-pointer"
      >
        <Image src="/delete.svg" alt="삭제" width={24} height={24} />
        삭제하기
      </button>
      <div className="mx-3 border-b border-Subbrown-4" />
      <button
        type="button"
        onClick={() => onSelectAction('approve')}
        className="flex-1 w-full flex items-center justify-center gap-2 body_1_2 text-Gray-4 hover:text-Gray-7 cursor-pointer"
      >
        <Image src="/accept.svg" alt="가입" width={24} height={24} />
        가입처리
      </button>
    </div>
  );
}

type JoinMessageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
};

function JoinMessageModal({ isOpen, onClose, message }: JoinMessageModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={onClose}
    >
      <div
        className="w-100 h-45 rounded-lg bg-White p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="body_1_2 text-Gray-4 whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
}

export default function AdminApplicantPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  const { setCustomTitle } = useHeaderTitle();
  const [applicants, setApplicants] = useState(DUMMY_APPLICANTS);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [messageModal, setMessageModal] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: '',
  });
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(applicants.length / itemsPerPage);

  // 모바일 헤더 타이틀 설정
  useEffect(() => {
    setCustomTitle('가입 신청 관리');
    return () => setCustomTitle(null);
  }, [setCustomTitle]);

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openMenuId === null) return;
      const menuRef = menuRefs.current[openMenuId];
      if (menuRef && !menuRef.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const handleActionClick = (applicantId: number) => {
    setOpenMenuId(openMenuId === applicantId ? null : applicantId);
  };

  const handleSelectAction = (applicantId: number, action: ActionType) => {
    if (action === 'delete') {
      // 신청 삭제
      setApplicants(applicants.filter((a) => a.id !== applicantId));
    } else if (action === 'approve') {
      // 가입 처리
      console.log('가입 처리:', applicantId);
      setApplicants(applicants.filter((a) => a.id !== applicantId));
    }
    setOpenMenuId(null);
  };

  const handleMessageClick = (message: string) => {
    setMessageModal({ isOpen: true, message });
  };

  const handleCloseMessageModal = () => {
    setMessageModal({ isOpen: false, message: '' });
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplicants = applicants.slice(startIndex, endIndex);

  return (
    <div className="w-full">

      <div className="t:hidden px-2.5 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-Gray-7 body_1_2"
        >
          <Image src="/back.svg" alt="뒤로가기" width={12} height={12} />
          <span>뒤로가기</span>
        </button>
      </div>
      <div className="t:hidden border-b border-Gray-2" />

      <div className="px-4.5 t:px-10 d:px-4">
        <div className="mx-auto w-full max-w-260 py-6">
          <div className="mb-2">
            <h1 className="subhead_1 t:subhead_3 text-Gray-7">모임 가입 신청 관리</h1>
          </div>
        <div className="mb-6">
          <p className="body_1_3 text-Gray-4 whitespace-pre-line">
          운영진은 가입 처리를 통해 회원의 가입 유무를 선택 가능합니다. <br/> 이때 공개모임의 경우 모든 신청마다 즉시 가입완료 처리 됩니다.
          </p>
        </div>

        {/* 테이블 */}
        <div className="w-full">
          <div>
            {/* 테이블 헤더 */}
            <div className="flex items-center border-b border-Subbrown-3">
              {/* ID - 태블릿/데스크탑에서만 */}
              <div className="hidden t:block t:w-28 d:w-45 t:px-3 d:px-4 py-3 shrink-0">
                <p className="body_1_2 text-Gray-4">ID</p>
              </div>
              <div className="w-14 t:w-16 d:w-45 py-3 t:px-3 d:px-4 shrink-0">
                <p className="body_1_2 text-Gray-4">이름</p>
              </div>
              {/* 이메일 - 태블릿/데스크탑에서만 */}
              <div className="hidden t:block t:w-40 d:w-42 t:px-3 d:px-4 py-3 shrink-0">
                <p className="body_1_2 text-Gray-4">이메일</p>
              </div>
              <div className="w-24 t:w-24 d:w-42 py-3 t:px-3 d:px-4 shrink-0">
                <p className="body_1_2 text-Gray-4">신청 일자</p>
              </div>
              <div className="w-14 t:w-24 d:w-28 py-3 t:px-3 d:px-4 shrink-0">
                <p className="body_1_2 text-Gray-4 t:hidden">프로필</p>
                <p className="body_1_2 text-Gray-4 hidden t:block">프로필 보기</p>
              </div>
              <div className="w-20 t:w-24 d:w-28 py-3 t:px-3 d:px-4 shrink-0">
                <p className="body_1_2 text-Gray-4">가입메시지</p>
              </div>
              <div className="w-12 t:w-20 d:w-28 py-3 t:px-3 d:px-4 shrink-0">
                <p className="body_1_2 text-Gray-4">수정</p>
              </div>
            </div>

            {/* 테이블 바디 */}
            <div className="divide-y divide-Subbrown-4 border-b border-Subbrown-4 overflow-visible">
              {currentApplicants.map((applicant) => (
                <div key={applicant.id} className="flex items-center">
                  {/* ID - 태블릿/데스크탑에서만 */}
                  <div className="hidden t:flex t:w-28 d:w-45 h-15 t:px-3 d:px-4 py-3 items-center gap-2 shrink-0">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0">
                      <Image
                        src="/profile2.svg"
                        alt={applicant.name}
                        fill
                        className="object-cover"
                        sizes="24px"
                      />
                    </div>
                    <p className="body_1_2 text-Gray-7 truncate">{applicant.userId}</p>
                  </div>
                  <div className="w-14 t:w-16 d:w-45 py-3 t:px-3 d:px-4 shrink-0">
                    <p className="body_1_2 text-Gray-7">{applicant.name}</p>
                  </div>
                  {/* 이메일 - 태블릿/데스크탑에서만 */}
                  <div className="hidden t:block t:w-40 d:w-42 t:px-3 d:px-4 py-3 shrink-0">
                    <p className="body_1_2 text-Gray-7 truncate">{applicant.email}</p>
                  </div>
                  <div className="w-24 t:w-24 d:w-42 py-3 t:px-3 d:px-4 shrink-0">
                    <p className="body_1_2 text-Gray-7">{applicant.applyDate}</p>
                  </div>
                  <div className="w-14 t:w-24 d:w-28 py-3 t:px-3 d:px-4 shrink-0">
                    <p className="body_1_2 text-Gray-7 underline underline-offset-2 cursor-pointer">바로가기</p>
                  </div>
                  <div className="w-20 t:w-24 d:w-28 py-3 t:px-3 d:px-4 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMessageClick(applicant.message)}
                      className="body_1_2 text-Gray-7 underline underline-offset-2 cursor-pointer"
                    >
                      가입메시지
                    </button>
                  </div>
                  <div className="w-12 t:w-20 d:w-28 py-3 t:px-3 d:px-4 shrink-0 relative" ref={(el) => { menuRefs.current[applicant.id] = el; }}>
                    <button
                      type="button"
                      ref={(el) => { buttonRefs.current[applicant.id] = el; }}
                      onClick={() => handleActionClick(applicant.id)}
                      className="body_1_2 text-Gray-7 underline underline-offset-2 cursor-pointer"
                    >
                      수정
                    </button>
                    <ApplicantActionDropdown
                      isOpen={openMenuId === applicant.id}
                      onSelectAction={(action) => handleSelectAction(applicant.id, action)}
                      buttonRef={{ current: buttonRefs.current[applicant.id] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Image
              src="/ArrowLeft2.svg"
              alt="이전"
              width={16}
              height={16}
              className="object-contain"
            />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 body_1_2 ${
                currentPage === page
                  ? 'text-Gray-7 font-semibold'
                  : 'text-Gray-4 hover:text-Gray-7'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Image
              src="/ArrowRight2.svg"
              alt="다음"
              width={16}
              height={16}
              className="object-contain"
            />
          </button>
        </div>
        </div>
      </div>

      {/* 가입 메시지 모달 */}
      <JoinMessageModal
        isOpen={messageModal.isOpen}
        onClose={handleCloseMessageModal}
        message={messageModal.message}
      />
    </div>
  );
}
