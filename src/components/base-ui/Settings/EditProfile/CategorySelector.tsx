// src/components/base-ui/Settings/CategorySelector.tsx
const CATEGORIES = [
  "소설/시/희곡",
  "에세이",
  "인문학",
  "사회과학",
  "정치/외교/국방",
  "역사/문화",
  "과학",
  "컴퓨터/IT",
  "예술/대중문화",
  "여행",
  "종교/철학",
  "자기계발",
  "어린이/청소년",
  "경제/경영",
  "외국어",
];

export default function CategorySelector() {
  return (
    <div className="flex flex-col items-start gap-[28px] self-stretch">
      <div className="flex items-end gap-[9px] self-stretch">
        <span className="body_1_2 text-primary-3">관심 카테고리</span>
        <span className="body_1_2 text-Gray-3">(최소 1개, 최대 6개 선택)</span>
      </div>

      {/* 태블릿: 3열(w-386px) / 데스크탑: 5열(w-full) */}
      <div
        className="grid gap-x-[10px] gap-y-[16px]
        w-[386px] grid-cols-3
        xl:w-full xl:grid-cols-5"
      >
        {CATEGORIES.map((cat) => (
          <div
            key={cat}
            className="flex h-[44px] w-[122px] cursor-pointer items-center justify-center gap-[8px] rounded-[400px] border border-Subbrown-3 bg-background px-[16px] py-[12px] hover:bg-white"
          >
            <span className="body_1_3 text-Gray-5">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
