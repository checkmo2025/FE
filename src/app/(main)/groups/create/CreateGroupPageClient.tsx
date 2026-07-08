"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import StepDot from "@/components/base-ui/Group-Create/StepDot";
import Chip from "@/components/base-ui/Group-Create/Chip";
import {
  BOOK_CATEGORIES,
  BookCategory,
  PARTICIPANT_LABEL_TO_TYPE,
  ParticipantLabel,
  PARTICIPANTS,
  ParticipantType,
} from "@/types/groups/groups";

import { mapBookCategoriesToCodes } from "@/types/groups/clubCreate";
import { useClubNameCheckMutation } from "@/hooks/queries/useCreateClubQueries";
import {
  useCreateClubMutation,
  useUploadClubImageMutation,
} from "@/hooks/mutations/useCreateClubMutation";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import { INPUT_LIMITS } from "@/constants/inputLimits";
import { clampTextToLimit, isTextOverLimit } from "@/utils/inputLimit";

type NameCheckState = "idle" | "checking" | "available" | "duplicate";
type SnsLink = { label: string; url: string };

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const PRIMARY_FILLED_BUTTON_CLASS =
  "bg-primary-1 text-White transition-colors hover:bg-primary-3 disabled:bg-Gray-2 disabled:hover:bg-Gray-2 disabled:cursor-not-allowed";
const SELECTABLE_BUTTON_ACTIVE_CLASS =
  "bg-primary-1 border-primary-1 text-White transition-colors hover:bg-primary-3 hover:border-primary-3";
const SELECTABLE_BUTTON_IDLE_CLASS =
  "bg-Subbrown-4 border-Subbrown-3 text-primary-3 transition-colors hover:bg-Subbrown-3";

const autoResize = (el: HTMLTextAreaElement) => {
  el.style.height = "0px";
  const H = el.scrollHeight + 5;
  el.style.height = `${H}px`;
};

export default function CreateGroupPageClient() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  // Step 1
  const [clubName, setClubName] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [nameCheck, setNameCheck] = useState<NameCheckState>("idle");

  const DuplicationCheckisConfirmed = nameCheck === "available";
  const DuplicationCheckisDisabled =
    !clubName.trim() || nameCheck === "checking" || DuplicationCheckisConfirmed;

  // Step 2
  const [profileMode, setProfileMode] = useState<"default" | "upload">("default");
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  // ✅ 서버에 그대로 보내는 값: open(boolean)
  const [open, setOpen] = useState<boolean | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);

  // Step 3
  const [selectedCategories, setSelectedCategories] = useState<BookCategory[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<ParticipantLabel[]>([]);
  const [activityArea, setActivityArea] = useState("");

  // Step 4
  const [links, setLinks] = useState<SnsLink[]>([{ label: "", url: "" }]);

  // API hooks
  const checkNameMutation = useClubNameCheckMutation();
  const uploadImage = useUploadClubImageMutation();
  const createClub = useCreateClubMutation();

  const canNext = useMemo(() => {
    if (step === 1)
      return Boolean(clubName.trim() && clubDescription.trim() && nameCheck === "available");

    if (step === 2) {
      // ✅ 공개/비공개는 필수
      if (open === null) return false;

      // 업로드 모드면 업로드 완료(=profileImageUrl 확보)까지 기다리게
      if (profileMode === "upload") return Boolean(profileImageUrl) && !uploadImage.isPending;

      // 기본 프로필 모드는 그냥 통과
      return true;
    }

    if (step === 3)
      return selectedCategories.length > 0 && selectedParticipants.length > 0 && activityArea.trim().length > 0;

    if (step === 4) return true;

    return false;
  }, [
    step,
    clubName,
    clubDescription,
    nameCheck,
    open,
    profileMode,
    profileImageUrl,
    uploadImage.isPending,
    selectedCategories,
    selectedParticipants,
    activityArea,
  ]);

  const onPrev = () => setStep((v) => Math.max(1, v - 1));
  const onNext = () => setStep((v) => Math.min(4, v + 1));

  // 2) 모임 이름 중복 확인
  const onCheckName = async () => {
    const name = clubName.trim();
    if (!name) return;
    if (
      isTextOverLimit(
        name,
        INPUT_LIMITS.CLUB_NAME,
        `모임 이름은 ${INPUT_LIMITS.CLUB_NAME}자 이하여야 합니다.`
      )
    ) {
      return;
    }

    setNameCheck("checking");

    try {
      const isDuplicate = await checkNameMutation.mutateAsync(name);

      if (isDuplicate) {
        setNameCheck("duplicate");
        toast.error("이미 존재하는 모임 이름입니다.");
      } else {
        setNameCheck("available");
        toast.success("사용 가능한 모임 이름입니다.");
      }
    } catch {
      setNameCheck("idle");
      toast.error("이름 중복 확인 실패");
    }
  };

  // 이미지 선택: 미리보기 + 업로드 + imageUrl 저장
  const pickImage = async (file: File) => {
    // 로컬 미리보기
    const reader = new FileReader();
    reader.onloadend = () => setSelectedImageUrl(reader.result as string);
    reader.readAsDataURL(file);

    try {
      const imageUrl = await uploadImage.mutateAsync(file);
      setProfileImageUrl(imageUrl);
      toast.success("프로필 이미지 업로드 완료");
    } catch {
      setProfileImageUrl(null);
      toast.error("이미지 업로드 실패");

      // ✅ 같은 파일 다시 선택 가능하게 input 초기화
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const toggleWithLimit = <T,>(arr: T[], item: T, limit: number) => {
    if (arr.includes(item)) return arr.filter((x) => x !== item);
    if (arr.length >= limit) {
      toast.error(`최대 ${limit}개까지 선택할 수 있습니다.`, { id: `selection-limit-${limit}` });
      return arr;
    }
    return [...arr, item];
  };

  const updateLink = (idx: number, patch: Partial<SnsLink>) => {
    setLinks((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  const addLinkRow = () =>
    setLinks((prev) => {
      if (prev.length >= INPUT_LIMITS.CLUB_LINK_COUNT) {
        toast.error(`문의 링크는 최대 ${INPUT_LIMITS.CLUB_LINK_COUNT}개까지 입력할 수 있습니다.`);
        return prev;
      }

      return [...prev, { label: "", url: "" }];
    });

  const removeLinkRow = (idx: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== idx));
  };

  const isDirty = useMemo(
    () =>
      Boolean(
        clubName.trim() ||
          clubDescription.trim() ||
          profileMode !== "default" ||
          selectedImageUrl ||
          profileImageUrl ||
          open !== null ||
          selectedCategories.length > 0 ||
          selectedParticipants.length > 0 ||
          activityArea.trim() ||
          links.some((link) => link.label.trim() || link.url.trim())
      ),
    [
      clubName,
      clubDescription,
      profileMode,
      selectedImageUrl,
      profileImageUrl,
      open,
      selectedCategories,
      selectedParticipants,
      activityArea,
      links,
    ]
  );
  const { runWithoutGuard } = useUnsavedChangesGuard({
    isDirty,
    variant: "create",
    title: "작성 중인 모임 정보가 있어요",
    description: "이 화면을 나가면 입력한 모임 정보가 저장되지 않습니다.",
  });

  // 모임 생성 (최종)
  const onSubmitCreateClub = async () => {
    // 안전장치: Step2 open 미선택이면 막기
    if (open === null) {
      toast.error("공개/비공개를 선택해주세요.");
      return;
    }
    if (
      isTextOverLimit(
        clubName.trim(),
        INPUT_LIMITS.CLUB_NAME,
        `모임 이름은 ${INPUT_LIMITS.CLUB_NAME}자 이하여야 합니다.`
      ) ||
      isTextOverLimit(
        clubDescription.trim(),
        INPUT_LIMITS.CLUB_DESCRIPTION,
        `모임 소개글은 ${INPUT_LIMITS.CLUB_DESCRIPTION}자 이하여야 합니다.`
      ) ||
      isTextOverLimit(
        activityArea.trim(),
        INPUT_LIMITS.CLUB_REGION,
        `활동 지역은 ${INPUT_LIMITS.CLUB_REGION}자 이하여야 합니다.`
      )
    ) {
      return;
    }

    try {
      const category = mapBookCategoriesToCodes(selectedCategories);
      const participantTypes: ParticipantType[] = selectedParticipants.map(
        (label) => PARTICIPANT_LABEL_TO_TYPE[label]
      );

      const linksPayload = links
        .map((l) => ({ label: l.label.trim(), link: l.url.trim() }))
        .filter((l) => l.label && l.link);

      if (linksPayload.length > INPUT_LIMITS.CLUB_LINK_COUNT) {
        toast.error(`문의 링크는 최대 ${INPUT_LIMITS.CLUB_LINK_COUNT}개까지 입력할 수 있습니다.`);
        return;
      }

      if (
        linksPayload.some((link) =>
          isTextOverLimit(
            link.label,
            INPUT_LIMITS.CLUB_LINK_LABEL,
            `문의 링크 이름은 ${INPUT_LIMITS.CLUB_LINK_LABEL}자 이하여야 합니다.`
          )
        ) ||
        linksPayload.some((link) =>
          isTextOverLimit(
            link.link,
            INPUT_LIMITS.CLUB_LINK_URL,
            `문의 링크는 ${INPUT_LIMITS.CLUB_LINK_URL}자 이하여야 합니다.`
          )
        )
      ) {
        return;
      }

      const payload = {
        name: clubName.trim(),
        description: clubDescription.trim(),
        profileImageUrl: profileMode === "upload" ? profileImageUrl : null,
        region: activityArea.trim(),
        category,
        participantTypes,
        links: linksPayload,
        open: open === true, // ✅ boolean 확정
      };

      // ✅ 규칙대로면 service에서 res.result(string)만 반환해야 함
      const msg = await createClub.mutateAsync(payload);
      toast.success(msg.result);

      runWithoutGuard(() => router.push("/groups"));
    } catch {
      toast.error("모임 생성 실패");
    }
  };

  return (
    <div className="min-h-screen max-w-[1440px] mx-auto">
      {/* breadcrumb */}
      <div className="flex gap-5 px-[10px] py-3 border-b border-Gray-2 t:mx-4">
        <Link href="/groups" className="shrink-0">
          <p className="body_1 t:subhead_4_1 cursor-pointer">모임</p>
        </Link>

        <Image className="block t:hidden shrink-0" src="/Polygon.svg" alt="" width={9} height={9} />
        <Image className="hidden t:block shrink-0" src="/Polygon.svg" alt="" width={16} height={16} />
        <p className="body_1 t:subhead_4_1">새 모임 생성</p>
      </div>

      <div className="w-full max-w-[1040px] mx-auto px-6 t:px-10 pt-6 pb-16">
        {/* step dots */}
        <div className="mb-7">
          <div className="flex items-center gap-6">
            <StepDot n={1} current={step} />
            <StepDot n={2} current={step} />
            <StepDot n={3} current={step} />
            <StepDot n={4} current={step} />
          </div>
        </div>

        <main>
          {/* STEP 1 */}
          {step === 1 && (
            <section>
              <h2 className="subhead_4_1 t:subhead_1">독서 모임 이름을 입력해주세요!</h2>

              <div className="mt-4 flex items-center gap-5">
                <input
                  value={clubName}
                  onChange={(e) => {
                    setClubName(
                      clampTextToLimit(
                        e.target.value,
                        INPUT_LIMITS.CLUB_NAME,
                        `모임 이름은 ${INPUT_LIMITS.CLUB_NAME}자 이하여야 합니다.`
                      )
                    );
                    setNameCheck("idle");
                  }}
                  placeholder="독서 모임 이름을 입력해주세요."
                  className="w-full h-[44px] t:h-[56px] rounded-[8px] border border-[#EAE5E2] p-4 outline-none bg-white body_1_3 t:subhead_4_1"
                />

                <button
                  type="button"
                  onClick={onCheckName}
                  disabled={DuplicationCheckisDisabled}
                  aria-busy={nameCheck === "checking"}
                  className={cx(
                    `
                      flex justify-center items-center
                      w-[100px] h-[48px] t:w-[128px] t:h-[56px]
                      px-1 py-3 rounded-[8px]
                      body_1_2
                      active:opacity-80
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `,
                    DuplicationCheckisConfirmed
                      ? `${SELECTABLE_BUTTON_ACTIVE_CLASS} disabled:hover:bg-primary-1 disabled:hover:border-primary-1 disabled:opacity-100 disabled:cursor-default`
                      : SELECTABLE_BUTTON_IDLE_CLASS
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

              <h2 className="mt-[56px] subhead_4_1 t:subhead_1">모임의 소개글을 입력해주세요!</h2>
              <textarea
                value={clubDescription}
                onChange={(e) => {
                  setClubDescription(
                    clampTextToLimit(
                      e.target.value,
                      INPUT_LIMITS.CLUB_DESCRIPTION,
                      `모임 소개글은 ${INPUT_LIMITS.CLUB_DESCRIPTION}자 이하여야 합니다.`
                    )
                  );
                  autoResize(e.currentTarget);
                }}
                onInput={(e) => autoResize(e.currentTarget)}
                placeholder={`자유롭게 입력해주세요! (${INPUT_LIMITS.CLUB_DESCRIPTION}자 제한)`}
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
                    PRIMARY_FILLED_BUTTON_CLASS
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
              <h2 className="subhead_4_1 t:subhead_1 text-Gray-7">모임의 프로필 사진을 업로드 해주세요!</h2>

              <div className="mt-4 flex items-start gap-6">
                <div className="relative w-[96px] h-[80px] t:w-[194px] t:h-[162px] rounded-[10px] overflow-hidden bg-Subbrown-4 flex items-center justify-center">
                  {selectedImageUrl ? (
                    <img src={selectedImageUrl} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Image
                        src="/default_profile_2.svg"
                        alt="기본 프로필"
                        fill
                        sizes="96px"
                        className="object-contain t:hidden"
                        priority
                      />
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

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImageUrl(null);
                      setProfileImageUrl(null);
                      setProfileMode("default");
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    className={cx(
                      "flex justify-center items-center gap-[10px] w-[200px] h-[36px] px-4 py-3 rounded-[8px] border body_1_3",
                      "active:opacity-80",
                      profileMode === "default"
                        ? SELECTABLE_BUTTON_ACTIVE_CLASS
                        : SELECTABLE_BUTTON_IDLE_CLASS
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
                      "active:opacity-80",
                      profileMode === "upload"
                        ? SELECTABLE_BUTTON_ACTIVE_CLASS
                        : SELECTABLE_BUTTON_IDLE_CLASS
                    )}
                  >
                    사진 업로드하기
                  </button>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setProfileMode("upload");
                        pickImage(f);
                      }
                    }}
                  />

                  {profileMode === "upload" && (
                    <p className="body_1_4 text-Gray-3">
                      {uploadImage.isPending
                        ? "업로드 중..."
                        : profileImageUrl
                        ? ""
                        : "업로드 실패 시 다시 시도"}
                    </p>
                  )}
                </div>
              </div>

              <h2 className="mt-7 subhead_4_1 t:subhead_1 text-Gray-7">모임의 공개여부를 알려주세요!</h2>

              <div className="mt-4 flex flex-col gap-3 text-Gray-7">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-3 cursor-pointer select-none text-left"
                >
                  <Image
                    src={open === true ? "/CheckBox_Yes.svg" : "/CheckBox_No.svg"}
                    alt=""
                    width={24}
                    height={24}
                  />
                  <span className="subhead_4_1">공개</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 cursor-pointer select-none text-left"
                >
                  <Image
                    src={open === false ? "/CheckBox_Yes.svg" : "/CheckBox_No.svg"}
                    alt=""
                    width={24}
                    height={24}
                  />
                  <span className="subhead_4_1">비공개</span>
                </button>
              </div>

              <div className="mt-7 flex justify-end t:gap-3">
                <button
                  type="button"
                  onClick={onPrev}
                  className={cx(
                    "hidden t:flex justify-center items-center gap-[10px] w-[148px] h-[48px] px-4 py-3 rounded-[8px]",
                    PRIMARY_FILLED_BUTTON_CLASS
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
                    PRIMARY_FILLED_BUTTON_CLASS
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
                <span className="text-[12px] text-[#8D8D8D]">(최대 6개)</span>
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
                onChange={(e) =>
                  setActivityArea(
                    clampTextToLimit(
                      e.target.value,
                      INPUT_LIMITS.CLUB_REGION,
                      `활동 지역은 ${INPUT_LIMITS.CLUB_REGION}자 이하여야 합니다.`
                    )
                  )
                }
                placeholder={`활동 지역을 입력해주세요 (${INPUT_LIMITS.CLUB_REGION}자 제한)`}
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

              <div className="mt-7 flex justify-end t:gap-3">
                <button
                  type="button"
                  onClick={onPrev}
                  className={cx(
                    "hidden t:flex justify-center items-center gap-[10px] w-[148px] h-[48px] px-4 py-3 rounded-[8px]",
                    PRIMARY_FILLED_BUTTON_CLASS
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
                    PRIMARY_FILLED_BUTTON_CLASS
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
              <h2 className="subhead_4_1 t:subhead_1 mb-4">SNS나 링크 연동이 있다면 해주세요! (선택)</h2>

              <div>
                {links.map((it, idx) => (
                  <div key={idx} className="flex flex-col gap-4 py-3 t:flex-row t:items-center">
                    <input
                      value={it.label}
                      onChange={(e) =>
                        updateLink(idx, {
                          label: clampTextToLimit(
                            e.target.value,
                            INPUT_LIMITS.CLUB_LINK_LABEL,
                            `문의 링크 이름은 ${INPUT_LIMITS.CLUB_LINK_LABEL}자 이하여야 합니다.`
                          ),
                        })
                      }
                      placeholder={`링크 대체 텍스트 입력(최대 ${INPUT_LIMITS.CLUB_LINK_LABEL}자)`}
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
                        onChange={(e) =>
                          updateLink(idx, {
                            url: clampTextToLimit(
                              e.target.value,
                              INPUT_LIMITS.CLUB_LINK_URL,
                              `문의 링크는 ${INPUT_LIMITS.CLUB_LINK_URL}자 이하여야 합니다.`
                            ),
                          })
                        }
                        placeholder={`링크 입력(최대 ${INPUT_LIMITS.CLUB_LINK_URL}자)`}
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
                        <Image src={"/icon_minus_1.svg"} alt="" width={24} height={24} />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addLinkRow}
                  disabled={links.length >= INPUT_LIMITS.CLUB_LINK_COUNT}
                  className="
                    w-full h-[56px] rounded-[8px]
                    bg-Gray-1
                    flex items-center justify-center
                    hover:bg-Gray-2
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-Gray-1
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
                    PRIMARY_FILLED_BUTTON_CLASS
                  )}
                >
                  이전
                </button>

                <button
                  type="button"
                  onClick={onSubmitCreateClub}
                  disabled={!canNext || createClub.isPending || uploadImage.isPending}
                  className={cx(
                    "flex justify-center items-center gap-[10px] h-[48px] px-4 py-3 rounded-[8px]",
                    "w-full t:w-[148px]",
                    PRIMARY_FILLED_BUTTON_CLASS
                  )}
                >
                  {createClub.isPending ? "생성 중..." : "모임 생성"}
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
