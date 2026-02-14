'use client'
import React, { useMemo, useRef, useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import StepDot from "@/components/base-ui/Group-Create/StepDot";
import Chip from "@/components/base-ui/Group-Create/Chip";
import { BOOK_CATEGORIES, BookCategory, PARTICIPANT_LABEL_TO_TYPE, ParticipantLabel, PARTICIPANTS, ParticipantType } from "@/types/groups/groups";

type NameCheckState = "idle" | "checking" | "available" | "duplicate";

type SnsLink = { label: string; url: string };

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const autoResize = (el: HTMLTextAreaElement) => {
  el.style.height = "0px"; // shrink 먼저
  const H = el.scrollHeight + 5;
  el.style.height = `${H}px`; // 내용만큼 늘리기
};

export default function CreateClubWizardPreview() {
  const [step, setStep] = useState(1);

  // Step 1
  const [clubName, setClubName] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [nameCheck, setNameCheck] = useState<NameCheckState>("idle");
  const DuplicationCheckisConfirmed = nameCheck === "available";
  const DuplicationCheckisDisabled = !clubName.trim() || nameCheck === "checking" || DuplicationCheckisConfirmed ;

  // Step 2
  const [profileMode, setProfileMode] = useState<"default" | "upload">("default");
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<"공개" | "비공개" | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  // Step 3
  const [selectedCategories, setSelectedCategories] = useState<BookCategory[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<ParticipantLabel[]>([]);
  const [activityArea, setActivityArea] = useState("");

  // Step 4
  const [links, setLinks] = useState<SnsLink[]>([{ label: "", url: "" }]);

  const canNext = useMemo(() => {
    if (step === 1) return Boolean(clubName.trim() && clubDescription.trim() && nameCheck === "available");
    if (step === 2) return Boolean(visibility);
    if (step === 3) return selectedCategories.length > 0 && selectedParticipants.length > 0 && activityArea.trim();
    if (step === 4) return true; // 선택
    return false;
  }, [step, clubName, clubDescription,nameCheck ,visibility, selectedCategories, selectedParticipants, activityArea]);

  const onPrev = () => setStep((v) => Math.max(1, v - 1));
  const onNext = () => setStep((v) => Math.min(4, v + 1));

  const fakeCheckName = () => {
    if (!clubName.trim()) return;
    setNameCheck("checking");
    setTimeout(() => {
      // 그냥 프리뷰용: 이름에 "중복" 들어가면 duplicate 처리
      if (clubName.includes("중복")) setNameCheck("duplicate");
      else setNameCheck("available");
    }, 500);
  };

  const pickImage = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setSelectedImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const toggleWithLimit = <T,>(arr: T[], item: T, limit: number) => {
  if (arr.includes(item)) return arr.filter((x) => x !== item);
  if (arr.length >= limit) return arr;
  return [...arr, item];
};

  const updateLink = (idx: number, patch: Partial<SnsLink>) => {
    setLinks((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  const addLinkRow = () => {
    setLinks((prev) => [...prev, { label: "", url: "" }]);
  };

  const removeLinkRow = (idx: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen max-w-[1440px] mx-auto ">
      

        {/* breadcrumb */}
        <div className="flex gap-5 px-[10px] py-3 border-b border-Gray-2 t:mx-4 ">
          <Link href="/groups" className="shrink-0">
            <p className="body_1 t:subhead_4_1 cursor-pointer">모임</p>
          </Link>

          <Image
            className="block t:hidden shrink-0"
            src="/Polygon.svg"
            alt=""
            width={9}
            height={9}
          />

          <Image
            className="hidden t:block shrink-0"
            src="/Polygon.svg"
            alt=""
            width={16}
            height={16}
          />

          <p className="body_1 t:subhead_4_1">새 모임 생성</p>
        </div>


        <div className="w-full max-w-[1040px] mx-auto px-6 t:px-10 pt-6 pb-16 ">
          {/* step dots */}
          <div className="mb-7">
            <div className="flex items-center gap-6">
              <StepDot n={1} current={step} />
              <StepDot n={2} current={step} />
              <StepDot n={3} current={step} />
              <StepDot n={4} current={step} />
            </div>
          </div>

        {/* 본문 박스 */}
        <main className="">

          {/* STEP 1 */}
          {step === 1 && (
                  <section>
                    <h2 className="subhead_4_1 t:subhead_1">
                      독서 모임 이름을 입력해주세요!
                    </h2>

                    <div className="mt-4 flex items-center gap-5">
                      <input
                        value={clubName}
                        onChange={(e) => {
                          setClubName(e.target.value);
                          setNameCheck("idle");
                        }}
                        placeholder="독서 모임 이름을 입력해주세요."
                        className="w-full h-[44px] t:h-[56px] rounded-[8px] border border-[#EAE5E2] p-4 outline-none  bg-white  body_1_3 t:subhead_4_1"
                      />

                      <button
                        type="button"
                        onClick={fakeCheckName}
                        disabled={DuplicationCheckisDisabled}
                        aria-busy={nameCheck === "checking"}
                        className={cx(
                          `
                            flex justify-center items-center
                            w-[100px] h-[48px] t:w-[128px] t:h-[56px]
                            px-1 py-3 rounded-[8px]
                            body_1_2
                            hover:opacity-90 active:opacity-80
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `,
                          DuplicationCheckisConfirmed 
                            ? "bg-primary-1 text-White border border-primary-1 disabled:opacity-100 disabled:cursor-default"
                            : "border border-Subbrown-3 bg-Subbrown-4 text-primary-3"
                        )}
                      >
                        {nameCheck === "checking" ? "확인중" : "중복확인"}
                      </button>

                    </div>

                    <div className="body_2_3 t:body_1_3 text-Gray-3 mt-3">
                      다른 이름을 입력하거나, 기수 또는 지역명을 추가해 구분해주세요.
                      <br />
                      예) 독서재량 2기, 독서재량 서울, 북적북적 인문학팀
                    </div>

                    <div className="mt-1 text-[12px]">
                      {nameCheck === "available" && (
                        <p className="text-[#367216] body_1_4">사용 가능한 모임 이름입니다.</p>
                      )}
                      {nameCheck === "duplicate" && (
                        <p className="text-[#FF8045] body_1_4">이미 존재하는 모임 이름입니다.</p>
                      )}
                    </div>

                    <h2 className="mt-[56px] subhead_1 subhead_4_1 t:subhead_1">
                      모임의 소개글을 입력해주세요!
                    </h2>
                    <textarea
                      value={clubDescription}
                      onChange={(e) => {
                        setClubDescription(e.target.value);
                        autoResize(e.currentTarget);
                      }}
                      onInput={(e) => autoResize(e.currentTarget)} // 초기/붙여넣기 대응
                      placeholder="자유롭게 입력해주세요! (500자 제한)"
                      className="
                        w-full
                        min-h-[200px] t:min-h-[260px]
                        rounded-[8px]
                        border border-Subbrown-4
                        bg-White
                        p-5 mt-5
                        no-scrollbar
                        resize-none
                        outline-none
                        Body_1_3
                        placeholder:text-Gray-3
                      "
                    />                        
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={onNext}
                        disabled={!canNext}
                        className={cx(
                          "flex justify-center items-center gap-[10px] h-[48px] px-4 py-3 rounded-[8px]",
                          "w-full t:w-[148px]",
                          "bg-primary-1 hover:bg-primary-3 text-White",
                          "disabled:bg-Gray-2 disabled:hover:bg-Gray-2 disabled:cursor-not-allowed"
                        )}
                      >
                        다음
                      </button>

                    </div>
                  </section>
          )}
          {/* STEP 2 */}
          {step === 2 && (
              <section>
                <h2 className="subhead_4_1 t:subhead_1 text-Gray-7">
                  모임의 프로필 사진을 업로드 해주세요!
                </h2>

                <div className="mt-4 flex items-start gap-6">
                  {/* profile preview */}
                  <div className="relative w-[96px] h-[80px] t:w-[194px] t:h-[162px] rounded-[10px] overflow-hidden bg-Subbrown-4 flex items-center justify-center">
                    {selectedImageUrl ? (
                      <img
                        src={selectedImageUrl}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        {/* mobile default */}
                        <Image
                          src="/default_profile_2.svg"
                          alt="기본 프로필"
                          fill
                          sizes="96px"
                          className="object-contain t:hidden"
                          priority
                        />
                        {/* t~ desktop default */}
                        <Image
                          src="/default_profile_1.svg"
                          alt="기본 프로필"
                          fill
                          sizes="194px"
                          className="object-contain hidden t:block"
                          priority
                        />
                      </>
                    )}
                  </div>

                  {/* action buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImageUrl(null);
                        setProfileMode("default");
                      }}
                      className={cx(
                        "flex justify-center items-center gap-[10px] w-[200px] h-[36px] px-4 py-3 rounded-[8px] border body_1_3",
                        "hover:opacity-90 active:opacity-80",
                        profileMode === "default"
                          ? "bg-primary-1 border-primary-1 text-White"
                          : "bg-Subbrown-4 border-Subbrown-3 text-primary-3"
                      )}
                    >
                      기본 프로필 사용하기
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMode("upload");
                        fileRef.current?.click();
                      }}
                      className={cx(
                        "flex justify-center items-center gap-[10px] w-[200px] h-[36px] px-4 py-3 rounded-[8px] border body_1_3",
                        "hover:opacity-90 active:opacity-80",
                        profileMode === "upload"
                          ? "bg-primary-1 border-primary-1 text-White"
                          : "bg-Subbrown-4 border-Subbrown-3 text-primary-3"
                      )}
                    >
                      사진 업로드하기
                    </button>

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setProfileMode("upload");
                          pickImage(f);
                        }
                      }}
                    />
                  </div>
                </div>

                <h2 className="mt-7 subhead_4_1 t:subhead_1 text-Gray-7">
                  모임의 공개여부를 알려주세요!
                </h2>

                <div className="mt-4 flex flex-col gap-3 text-Gray-7">
                  <button
                    type="button"
                    onClick={() => setVisibility("공개")}
                    className="flex items-center gap-3 cursor-pointer select-none text-left"
                  >
                    <Image
                      src={visibility === "공개" ? "/CheckBox_Yes.svg" : "/CheckBox_No.svg"}
                      alt=""
                      width={24}
                      height={24}
                    />
                    <span className="subhead_4_1">공개</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisibility("비공개")}
                    className="flex items-center gap-3 cursor-pointer select-none text-left"
                  >
                    <Image
                      src={visibility === "비공개" ? "/CheckBox_Yes.svg" : "/CheckBox_No.svg"}
                      alt=""
                      width={24}
                      height={24}
                    />
                    <span className="subhead_4_1">비공개</span>
                  </button>
                </div>

                {/* bottom buttons: mobile = 다음 풀폭, t~ = 이전/다음 오른쪽 정렬 */}
                <div className="mt-7 flex justify-end t:gap-3">
                  <button
                    type="button"
                    onClick={onPrev}
                    className={cx(
                      "hidden t:flex justify-center items-center gap-[10px] w-[148px] h-[48px] px-4 py-3 rounded-[8px]",
                      "bg-primary-1 hover:bg-primary-3 text-White",
                      "disabled:bg-Gray-2 disabled:hover:bg-Gray-2 disabled:cursor-not-allowed"
                    )}
                  >
                    이전
                  </button>

                  <button
                    type="button"
                    onClick={onNext}
                    disabled={!canNext}
                    className={cx(
                      "flex justify-center items-center gap-[10px] h-[48px] px-4 py-3 rounded-[8px]",
                      "w-full t:w-[148px]",
                      "bg-primary-1 hover:bg-primary-3 text-White",
                      "disabled:bg-Gray-2 disabled:hover:bg-Gray-2 disabled:cursor-not-allowed"
                    )}
                  >
                    다음
                  </button>
                </div>
              </section>
          )}
          {/* STEP 3 */}
          {step === 3 && (
                  <section>
                    <h2 className="subhead_4_1 t:subhead_1">
                      선호하는 독서 카테고리를 선택해주세요!{" "}
                      <span className="hidden t:box Gray_4 caption_1_1">(최대 6개)</span>
                    </h2>

                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {BOOK_CATEGORIES.map((c) => (
                        <Chip
                          key={c}
                          label={c}
                          selected={selectedCategories.includes(c)}
                          onClick={() => setSelectedCategories((prev) => toggleWithLimit(prev, c, 6))}
                        />
                      ))}
                    </div>

                    <h2 className="mt-10 text-[18px] font-semibold text-[#2C2C2C]">활동 지역을 입력해주세요!</h2>
                    <input
                      value={activityArea}
                      onChange={(e) => setActivityArea(e.target.value)}
                      placeholder="활동 지역을 입력해주세요 (40자 제한)"
                      className="mt-4 w-full h-[44px] t:h-[56px] rounded-[8px] border border-[#EAE5E2] body_1_3 bg-white px-4 outline-none"
                    />

                    <h2 className="mt-10 text-[18px] font-semibold text-[#2C2C2C]">
                      모임의 대상을 선택해주세요! <span className="text-[12px] text-[#8D8D8D]">(최대 6개)</span>
                    </h2>

                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {PARTICIPANTS.map((p) => (
                        <Chip
                          key={p}
                          label={p}
                          selected={selectedParticipants.includes(p)}
                          onClick={() => setSelectedParticipants((prev) => toggleWithLimit(prev, p, 6))}
                        />
                      ))}
                    </div>

                    
                  {/* bottom buttons: mobile = 다음 풀폭, t~ = 이전/다음 오른쪽 정렬 */}
                  <div className="mt-7 flex justify-end t:gap-3">
                    <button
                      type="button"
                      onClick={onPrev}
                      className={cx(
                        "hidden t:flex justify-center items-center gap-[10px] w-[148px] h-[48px] px-4 py-3 rounded-[8px]",
                        "bg-primary-1 hover:bg-primary-3 text-White",
                        "disabled:bg-Gray-2 disabled:hover:bg-Gray-2 disabled:cursor-not-allowed"
                      )}
                    >
                      이전
                    </button>

                    <button
                      type="button"
                      onClick={onNext}
                      disabled={!canNext}
                      className={cx(
                        "flex justify-center items-center gap-[10px] h-[48px] px-4 py-3 rounded-[8px]",
                        "w-full t:w-[148px]",
                        "bg-primary-1 hover:bg-primary-3 text-White",
                        "disabled:bg-Gray-2 disabled:hover:bg-Gray-2 disabled:cursor-not-allowed"
                      )}
                    >
                      다음
                    </button>
                  </div>
                  </section>
          )}

          {/* STEP 4 */}
          {step === 4 && (
                  <section>
                    <h2 className="subhead_4_1 t:subhead_1 mb-4">
                      SNS나 링크 연동이 있다면 해주세요! (선택)
                    </h2>

                  <div className="">
                  {links.map((it, idx) => (
                    <div
                      key={idx}
                      className="
                        flex flex-col gap-4 py-3
                        t:flex-row t:items-center
                      "
                    >
                      <input
                        value={it.label}
                        onChange={(e) => updateLink(idx, { label: e.target.value })}
                        placeholder="링크 대체 텍스트 입력(최대 20자)"
                        maxLength={20}
                        className="
                          w-full t:w-[35%] h-[44px] t:h-[56px]
                          rounded-[8px]
                          border border-Subbrown-4
                          bg-White
                          px-4
                          outline-none
                          body_1_3
                          placeholder:text-Gray-3
                        "
                      />

                      <div className="flex gap-3 w-full t:flex-1">
                        <input
                          value={it.url}
                          onChange={(e) => updateLink(idx, { url: e.target.value })}
                          placeholder="링크 입력(최대 100자)"
                          maxLength={100}
                          className="
                            flex-1
                            h-[44px] t:h-[56px]
                            rounded-[8px]
                            border border-Subbrown-4 bg-White
                            px-4
                            outline-none
                            body_1_3
                            placeholder:text-Gray-3
                          "
                        />

                        <button
                          type="button"
                          onClick={() => removeLinkRow(idx)}
                          disabled={links.length <= 1}
                          className="
                            w-[44px] h-[44px] t:w-[56px] t:h-[56px]
                            rounded-[8px]
                            bg-Gray-1
                            flex items-center justify-center
                            hover:bg-Gray-2
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-Gray-1
                          "
                          title="삭제"
                        >
                          <Image
                            src={"/icon_minus_1.svg"}
                            alt=""
                            width={24}
                            height={24}
                          />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addLinkRow}
                    className="
                      w-full h-[56px] rounded-[8px]
                      bg-Gray-1
                      flex items-center justify-center
                      hover:bg-Gray-2
                    "
                    title="추가"
                  >
                    <Image src={"/icon_plus_1.svg"} alt="" width={24} height={24} />
                  </button>
                </div>




                    <div className="mt-10 flex justify-between">
                      <button
                      type="button"
                      onClick={onPrev}
                      className={cx(
                        "hidden t:flex justify-center items-center gap-[10px] w-[148px] h-[48px] px-4 py-3 rounded-[8px]",
                        "bg-primary-1 hover:bg-primary-3 text-White",
                        "disabled:bg-Gray-2 disabled:hover:bg-Gray-2 disabled:cursor-not-allowed"
                      )}
                    >
                      이전
                    </button>

                    <button
                      type="button"
                      onClick={onNext}
                      disabled={!canNext}
                      className={cx(
                        "flex justify-center items-center gap-[10px] h-[48px] px-4 py-3 rounded-[8px]",
                        "w-full t:w-[148px]",
                        "bg-primary-1 hover:bg-primary-3 text-White",
                        "disabled:bg-Gray-2 disabled:hover:bg-Gray-2 disabled:cursor-not-allowed"
                      )}
                    >
                      다음
                    </button>

                    </div>
                  </section>
          )}
        </main>
        </div>
    </div>
  );
}
