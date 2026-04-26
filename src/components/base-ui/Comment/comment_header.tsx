import Image from "next/image";
import { formatDate } from "@/utils/date";

type CommentHeaderProps = {
  authorName: string;
  profileImgSrc: string;
  isAuthor: boolean;
  createdAt: string;
  onProfileClick?: (nickname: string) => void;
};

export default function CommentHeader({
  authorName,
  profileImgSrc,
  isAuthor,
  createdAt,
  onProfileClick,
}: CommentHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div 
        className={`flex items-center gap-2 ${onProfileClick ? 'cursor-pointer group hover:bg-Gray-1 transition-colors rounded-lg px-2 py-1.5 -ml-2' : ''}`}
        onClick={() => onProfileClick?.(authorName)}
      >
        <div className={`relative w-8 h-8 shrink-0 rounded-full overflow-hidden transition-opacity ${onProfileClick ? 'group-hover:opacity-80' : ''}`}>
          <Image
            src={profileImgSrc}
            alt={authorName}
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>
        <span className={`Subhead_4_1 text-Gray-7 transition-opacity ${onProfileClick ? 'group-hover:opacity-80' : ''}`}>
          {authorName}
        </span>
        {isAuthor && (
          <span className={`px-2 py-0.5 Subhead_4 text-Gray-3 transition-opacity ${onProfileClick ? 'group-hover:opacity-80' : ''}`}>
            작성자
          </span>
        )}
      </div>
      <span className="Body_1_2 text-Gray-3">{formatDate(createdAt)}</span>
    </div>
  );
}
