type Variant = "home" | "club" | "story" | "news";

const CONTENT: Record<Variant, { cards: string[]; color: string }> = {
  home: {
    cards: ["나의 모임", "추천 도서", "최신 스토리", "다음 모임 일정"],
    color: "bg-Secondary-2/20",
  },
  club: {
    cards: ["독서 모임 찾기", "모임 만들기", "내 모임 목록", "신청 현황"],
    color: "bg-Secondary-4/20",
  },
  story: {
    cards: ["책 이야기", "스토리 작성", "리뷰 모아보기", "인기 스토리"],
    color: "bg-Secondary-3/20",
  },
  news: {
    cards: ["북페어 소식", "작가 만남", "도서관 행사", "전시 안내"],
    color: "bg-Secondary-1/20",
  },
};

interface DesktopMockupProps {
  variant: Variant;
}

export default function DesktopMockup({ variant }: DesktopMockupProps) {
  const { cards, color } = CONTENT[variant];

  return (
    <div className="w-full overflow-hidden rounded-xl shadow-2xl ring-1 ring-Gray-2">
      {/* Browser bar */}
      <div className="flex h-9 items-center gap-1.5 bg-primary-1 px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
        <div className="ml-3 h-4 flex-1 max-w-[200px] rounded-full bg-white/20" />
      </div>

      {/* App inner layout */}
      <div className="flex bg-background">
        {/* Sidebar (desktop only hint) */}
        <div className="hidden w-12 flex-shrink-0 bg-primary-1/10 t:flex flex-col items-center gap-3 py-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 w-6 rounded bg-primary-2/30" />
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-4">
          <div className="mb-3 h-5 w-32 rounded bg-Gray-2" />
          <div className="grid grid-cols-2 gap-3 t:grid-cols-2">
            {cards.map((label) => (
              <div
                key={label}
                className={`${color} flex flex-col gap-2 rounded-lg p-3`}
              >
                <div className="h-16 w-full rounded bg-white/60 t:h-24" />
                <div className="h-3 w-3/4 rounded bg-Gray-3" />
                <div className="h-2.5 w-1/2 rounded bg-Gray-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
