import CategorySelector from "@/components/base-ui/Settings/EditProfile/CategorySelector";
import ProfileImageSection from "@/components/base-ui/Settings/EditProfile/ProfileImageSection";

export default function ProfileEditPage() {
  const labelStyle =
    "self-stretch text-[14px] font-medium leading-[145%] tracking-[-0.014px] text-[#5E4A40]";
  const inputContainerStyle =
    "flex h-[52px] items-center gap-[10px] rounded-[8px] border border-[#EAE5E2] bg-white px-[16px] py-[12px]";
  const inputTextStyle =
    "w-full bg-transparent text-[14px] font-normal leading-[145%] tracking-[-0.014px] text-[#2C2C2C] outline-none placeholder:text-[#BBB]";

  return (
    <div className="flex w-[1152px] flex-col items-start gap-[24px] pb-[114px] pl-[68px] pr-[400px]">
      {/* 타이틀 영역 */}
      <div className="flex w-[1000px] items-center gap-[8px] border-b border-[#EAE5E2] pb-[28px] pt-[28px]">
        <h2 className="text-[20px] font-semibold leading-[135%] tracking-[-0.02px] text-[#434343]">
          프로필 편집
        </h2>
      </div>

      {/* 폼 본문 영역 */}
      <div className="flex w-[688px] flex-col items-center gap-[64px] px-[20px]">
        <div className="flex flex-col items-end gap-[40px] self-stretch">
          {/* 1. 이미지 업로드 섹션 */}
          <ProfileImageSection />

          {/* 2. 닉네임 입력 */}
          <div className="flex flex-col items-start gap-[12px] self-stretch">
            <label className={labelStyle}>닉네임</label>
            <div className="flex items-center gap-[8px] self-stretch">
              <div className={`${inputContainerStyle} w-[508px]`}>
                <input
                  className={inputTextStyle}
                  placeholder="변경할 닉네임을 입력해주세요"
                />
              </div>
              <button className="flex h-[52px] w-[132px] items-center justify-center gap-[10px] rounded-[8px] border border-[#D2C5B6] bg-[#EAE5E2]">
                <span className="text-[14px] font-normal leading-[145%] text-[#5E4A40]">
                  중복확인
                </span>
              </button>
            </div>
          </div>

          {/* 3. 소개 입력 */}
          <div className="flex flex-col items-start gap-[12px] self-stretch">
            <label className={labelStyle}>소개</label>
            <div className={`${inputContainerStyle} self-stretch`}>
              <input
                className={inputTextStyle}
                placeholder="20자 이내로 작성해주세요"
              />
            </div>
          </div>

          {/* 4. 이름 입력 */}
          <div className="flex flex-col items-start gap-[12px] self-stretch">
            <label className={labelStyle}>이름</label>
            <div className={`${inputContainerStyle} self-stretch`}>
              <input
                className={inputTextStyle}
                placeholder="이름을 입력해주세요"
              />
            </div>
          </div>

          {/* 5. 전화번호 입력 */}
          <div className="flex flex-col items-start gap-[12px] self-stretch">
            <label className={labelStyle}>전화번호</label>
            <div className={`${inputContainerStyle} self-stretch`}>
              <input className={inputTextStyle} placeholder="010-0000-0000" />
            </div>
          </div>

          {/* 6. 관심 카테고리 */}
          <CategorySelector />

          {/* 7. 저장 버튼 */}
          <button className="flex h-[48px] w-[200px] items-center justify-center gap-[10px] rounded-[8px] bg-[#7B6154] px-[16px] py-[12px]">
            <span className="text-[14px] font-semibold leading-[145%] text-white">
              저장하기
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
