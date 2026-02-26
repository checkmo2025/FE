'use client';

import Image from 'next/image';

type BookCoverCardVariant = 'search' | 'news';

type BookCoverCardProps = {
    imgUrl?: string;
    title: string;
    author: string;
    liked: boolean;
    onLikeChange: (next: boolean) => void;
    onCardClick?: () => void;
    className?: string;
    variant?: BookCoverCardVariant;
    responsive?: boolean; // Only used for 'news' variant
};

export default function BookCoverCard({
    imgUrl,
    title,
    author,
    liked,
    onLikeChange,
    onCardClick,
    className = '',
    variant = 'news',
    responsive = false,
}: BookCoverCardProps) {
    const coverSrc = imgUrl && imgUrl.length > 0 ? imgUrl : '/booksample.svg';

    // variant에 따른 스타일 분리
    const isSearch = variant === 'search';

    // 가로 너비 및 이미지 영역 크기 설정
    let containerWidth = '';
    let imageAreaSize = '';
    let imageSizes = '';

    if (isSearch) {
        containerWidth = 'w-[111px] t:w-[217px] d:w-[332px]';
        imageAreaSize = 'w-[111px] h-[144px] t:w-[217px] t:h-[286px] d:w-[332px] d:h-[436px]';
        imageSizes = '(max-width: 767px) 111px, (max-width: 1439px) 217px, 332px';
    } else {
        // news variant (recommendbook_element 로직 재사용)
        containerWidth = responsive ? 'w-[157px]' : 'w-61';
        imageAreaSize = responsive ? 'w-[157px] h-[206px]' : 'w-61 h-80';
        imageSizes = responsive ? '(max-width: 768px) 156px, 160px' : '244px';
    }

    // 텍스트 색상 설정
    const titleColor = isSearch ? 'text-white' : 'text-Gray-7';
    const authorColor = isSearch ? 'text-white/60' : 'text-Gray-5';

    // 텍스트 스타일 설정
    const titleStyle = isSearch ? 'subhead_4 t:subhead_1' : 'subhead_2';
    const authorStyle = isSearch ? 'body_2_3 t:subhead_4' : 'body_2';

    return (
        <div
            onClick={onCardClick}
            className={`flex flex-col items-start gap-3 ${containerWidth} ${onCardClick ? 'cursor-pointer' : ''} ${className}`}
        >
            {/* 도서 커버 이미지 영역 */}
            <div className={`relative ${imageAreaSize} overflow-hidden rounded-lg shrink-0`}>
                <Image
                    src={coverSrc}
                    alt={title}
                    fill
                    sizes={imageSizes}
                    className="object-cover"
                />
            </div>

            {/* 정보 영역 (제목, 저자, 좋아요) */}
            <div className="flex items-start justify-between w-full pr-1">
                <div className="flex flex-col items-start min-w-0 pr-2">
                    <p className={`${titleColor} ${titleStyle} truncate w-full`}>
                        {title}
                    </p>
                    <p className={`${authorColor} ${authorStyle} truncate w-full`}>
                        {author}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onLikeChange(!liked);
                    }}
                    className="w-6 h-6 shrink-0 mt-0.5"
                >
                    <Image
                        src={liked ? '/red_heart.svg' : '/gray_heart.svg'}
                        alt="좋아요"
                        width={24}
                        height={24}
                    />
                </button>
            </div>
        </div>
    );
}
