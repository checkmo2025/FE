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
        <span className="text-[14px] font-medium leading-[145%] tracking-[-0.014px] text-[#5E4A40]">
          관심 카테고리
        </span>
        <span className="text-[14px] font-medium leading-[145%] tracking-[-0.014px] text-[#BBB]">
          (최소 1개, 최대 6개 선택)
        </span>
      </div>

      {/* 5열 그리드 배치 */}
      <div className="grid w-full grid-cols-5 gap-x-[10px] gap-y-[16px]">
        {CATEGORIES.map((cat) => (
          <div
            key={cat}
            className="flex h-[44px] w-[122px] items-center justify-center gap-[8px] rounded-[400px] border border-[#D2C5B6] bg-[#F9F7F6] px-[16px] py-[12px] cursor-pointer hover:bg-white"
          >
            <span className="text-[14px] font-normal leading-[145%] tracking-[-0.014px] text-[#5C5C5C]">
              {cat}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
