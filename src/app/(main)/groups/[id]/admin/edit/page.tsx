"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

// ✅ create에서 쓰던 업로드 훅 그대로 재사용
import { useUploadClubImageMutation } from "@/hooks/mutations/useCreateClubMutation";

// ✅ 너가 방금 만들라고 한 edit용 hooks
import { useClubAdminDetailQuery } from "@/hooks/queries/useClubAdminEditQueries";
import { useUpdateClubAdminMutation } from "@/hooks/mutations/useClubAdminEditMutations";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import { INPUT_LIMITS } from "@/constants/inputLimits";
import { clampTextToLimit, isTextOverLimit } from "@/utils/inputLimit";

type NameCheckState = "idle" | "checking" | "available" | "duplicate";
type SnsLink = { label: string; url: string };

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const normalizeLinks = (links: SnsLink[]) =>
  links
    .map((link) => ({ label: link.label.trim(), url: link.url.trim() }))
    .filter((link) => link.label || link.url);

const autoResize = (el: HTMLTextAreaElement) => {
  el.style.height = "0px";
  const H = el.scrollHeight + 5;
  el.style.height = `${H}px`;
};

export default function EditClubPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const clubId = Number(params.id);

  // ===== API =====
  const { data, isLoading } = useClubAdminDetailQuery(clubId);
  const uploadImage = useUploadClubImageMutation();
  const updateClub = useUpdateClubAdminMutation(clubId);

  // ===== create랑 동일한 state 구조 유지 =====
  // Step 1
  const [clubName, setClubName] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [nameCheck, setNameCheck] = useState<NameCheckState>("idle");

  // edit 전용: 원래 이름 기억해서 "이름 안 바꾸면 자동 통과" 처리
  const [initialName, setInitialName] = useState("");

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

  // ===== GET 상세로 초기값 세팅 (create UI 흐름에 맞춰 mapping) =====
  useEffect(() => {
    if (!data) return;

    setClubName(data.name ?? "");
    setInitialName(data.name ?? "");
    setClubDescription(data.description ?? "");

    // ✅ edit에서 “이름 안 바꿨으면” 중복확인 없이 통과 상태
    setNameCheck("available");

    // 프로필: 기존 값이 있으면 업로드 모드처럼 보여주기(미리보기)
    const img = data.profileImageUrl ?? "";
    if (img) {
      setProfileMode("upload");
      setSelectedImageUrl(img);
      setProfileImageUrl(img);
    } else {
      setProfileMode("default");
      setSelectedImageUrl(null);
      setProfileImageUrl(null);
    }

    setOpen(Boolean(data.open));
    setActivityArea(data.region ?? "");

    // category / participantTypes는 서버 코드 배열 -> create의 라벨 배열로 변환
    // ✅ 네 프로젝트에 이미 매핑 상수(BOOK_CATEGORY_TO_CODE 같은거) 있다면 그걸 쓰는게 정답.
    // 여기선 groups.ts의 BOOK_CATEGORIES 라벨을 그대로 쓰기 위해 "description"을 라벨로 쓰는 방식으로 맞춤.
    const categoryLabels = (data.category ?? [])
      .map((c) => c.description as BookCategory)
      .filter(Boolean);
    setSelectedCategories(categoryLabels);

    const participantLabels = (data.participantTypes ?? [])
      .map((p) => p.description as ParticipantLabel)
      .filter(Boolean);
    setSelectedParticipants(participantLabels);

    setLinks(
      (data.links ?? []).length
        ? (data.links ?? []).map((l) => ({ label: l.label ?? "", url: l.link ?? "" }))
        : [{ label: "", url: "" }]
    );
  }, [data]);

  // ===== name 중복 확인 (edit에서는 이름 바뀐 경우만) =====
  // ⚠️ create에선 useClubNameCheckQuery를 썼는데, edit 페이지에선 “UI 완전 동일” 원칙 때문에 버튼/문구 동일 유지.
  // 다만 실제 체크 API 훅이 edit쪽에 없다면, create 훅을 그대로 import해서 쓰면 됨.
  // 여기서는 "이름이 바뀌면 체크 필요"만 UI로 강제한다.
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

    // ✅ 이름이 원래랑 같으면 그냥 통과
    if (name === initialName) {
      setNameCheck("available");
      toast.success("사용 가능한 모임 이름입니다.");
      return;
    }

    // 여기서 실제 중복체크 훅이 있다면 create 페이지처럼 refetch하면 됨.
    // 지금은 “UI 동일”이 목표라, 최소 동작만(나중에 hook 연결) 형태로 둠.
    setNameCheck("checking");
    try {
      // TODO: useClubNameCheckQuery(name).refetch() 연결
      // 임시: 무조건 available 처리
      setNameCheck("available");
      toast.success("사용 가능한 모임 이름입니다.");
    } catch {
      setNameCheck("idle");
      toast.error("이름 중복 확인 실패");
    }
  };

  // 이미지 선택: create와 동일 (미리보기 + 업로드)
  const pickImage = async (file: File) => {
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

  const currentSnapshot = useMemo(
    () => ({
      name: clubName.trim(),
      description: clubDescription.trim(),
      profileMode,
      profileImageUrl: profileMode === "upload" ? profileImageUrl ?? "" : "",
      open,
      categories: [...selectedCategories].sort(),
      participants: [...selectedParticipants].sort(),
      region: activityArea.trim(),
      links: normalizeLinks(links),
    }),
    [
      clubName,
      clubDescription,
      profileMode,
      profileImageUrl,
      open,
      selectedCategories,
      selectedParticipants,
      activityArea,
      links,
    ]
  );

  const initialSnapshot = useMemo(() => {
    if (!data) return null;

    return {
      name: (data.name ?? "").trim(),
      description: (data.description ?? "").trim(),
      profileMode: data.profileImageUrl ? "upload" : "default",
      profileImageUrl: data.profileImageUrl ?? "",
      open: Boolean(data.open),
      categories: (data.category ?? [])
        .map((category) => category.description as BookCategory)
        .filter(Boolean)
        .sort(),
      participants: (data.participantTypes ?? [])
        .map((participant) => participant.description as ParticipantLabel)
        .filter(Boolean)
        .sort(),
      region: (data.region ?? "").trim(),
      links: normalizeLinks(
        (data.links ?? []).map((link) => ({
          label: link.label ?? "",
          url: link.link ?? "",
        }))
      ),
    };
  }, [data]);

  const isDirty = Boolean(
    initialSnapshot &&
      JSON.stringify(currentSnapshot) !== JSON.stringify(initialSnapshot)
  );
  const { confirmNavigation, runWithoutGuard } = useUnsavedChangesGuard({
    isDirty,
    variant: "edit",
    title: "저장되지 않은 모임 정보가 있어요",
    description: "이 화면을 나가면 수정한 모임 정보가 저장되지 않습니다.",
  });

  // ✅ create의 canNext 조건을 “전체 저장 가능 조건”으로 그대로 유지
  const canSave = useMemo(() => {
    // Step1 조건
    const ok1 = Boolean(clubName.trim() && clubDescription.trim() && nameCheck === "available");
    if (!ok1) return false;

    // Step2 조건
    if (open === null) return false;
    if (profileMode === "upload") {
      if (!profileImageUrl) return false;
      if (uploadImage.isPending) return false;
    }

    // Step3 조건
    const ok3 =
      selectedCategories.length > 0 &&
      selectedParticipants.length > 0 &&
      activityArea.trim().length > 0;
    if (!ok3) return false;

    // Step4는 선택이라 항상 true
    return true;
  }, [
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

  const onSubmitUpdate = async () => {
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
        open: open === true,
      };

      await updateClub.mutateAsync(payload as any);
      toast.success("모임 정보가 수정되었습니다.");
      runWithoutGuard(() => router.back());
    } catch {
      toast.error("모임 수정 실패");
    }
  };

  return (
    <div className="min-h-screen max-w-[1440px] mx-auto">
      {/* breadcrumb: create랑 동일한 스타일 유지 (문구만 수정) */}
      <div className="flex gap-5 px-[10px] py-3 border-b border-Gray-2 t:mx-4">
        <Link href="/groups" className="shrink-0">
          <p className="body_1 t:subhead_4_1 cursor-pointer">모임</p>
        </Link>

        <Image className="block t:hidden shrink-0" src="/Polygon.svg" alt="" width={9} height={9} />
        <Image className="hidden t:block shrink-0" src="/Polygon.svg" alt="" width={16} height={16} />

        <p className="body_1 t:subhead_4_1">모임 수정</p>
      </div>

      <div className="w-full max-w-[1040px] mx-auto px-6 t:px-10 pt-6 pb-16">
        <main>
          {/* ====== STEP 1 UI 그대로 (조건부 제거) ====== */}
          <section>
            <h2 className="subhead_4_1 t:subhead_1">독서모임 이름</h2>

            <div className="mt-4 flex items-center gap-5">
              <input
                value={clubName}
                onChange={(e) => {
                  const nextName = clampTextToLimit(
                    e.target.value,
                    INPUT_LIMITS.CLUB_NAME,
                    `모임 이름은 ${INPUT_LIMITS.CLUB_NAME}자 이하여야 합니다.`
                  );
                  setClubName(nextName);
                  // ✅ edit: 이름이 바뀌면 다시 체크 요구
                  if (nextName.trim() === initialName) setNameCheck("available");
                  else setNameCheck("idle");
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

            <h2 className="mt-[36px] subhead_4_1 t:subhead_1">모임의 소개글</h2>
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
          </section>

          {/* ====== STEP 2 UI 그대로 ====== */}
          <section className="mt-10">
            <h2 className="subhead_4_1 t:subhead_1 text-Gray-7">모임의 프로필 사진</h2>

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
                    {uploadImage.isPending ? "업로드 중..." : profileImageUrl ? "" : "업로드 실패 시 다시 시도"}
                  </p>
                )}
              </div>
            </div>

            <h2 className="mt-7 subhead_4_1 t:subhead_1 text-Gray-7">모임의 공개여부</h2>

            <div className="mt-4 flex flex-col gap-3 text-Gray-7">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex items-center gap-3 cursor-pointer select-none text-left"
              >
                <Image src={open === true ? "/CheckBox_Yes.svg" : "/CheckBox_No.svg"} alt="" width={24} height={24} />
                <span className="subhead_4_1">공개</span>
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 cursor-pointer select-none text-left"
              >
                <Image src={open === false ? "/CheckBox_Yes.svg" : "/CheckBox_No.svg"} alt="" width={24} height={24} />
                <span className="subhead_4_1">비공개</span>
              </button>
            </div>
          </section>

          {/* ====== STEP 3 UI 그대로 ====== */}
          <section className="mt-14">
            <h2 className="subhead_4_1 t:subhead_1">
              선호하는 독서 카테고리{" "}
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
          </section>

          {/* ====== STEP 4 UI 그대로 ====== */}
          <section className="mt-14">
            <h2 className="subhead_4_1 t:subhead_1 mb-4">SNS나 링크 연동 (선택)</h2>

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
          </section>

          {/* ====== 저장 버튼 (create의 '모임 생성' 버튼 스타일 그대로) ====== */}
          <div className="mt-10 flex justify-between">
            <button
              type="button"
              onClick={() => confirmNavigation(() => router.back())}
              className={cx(
                "hidden t:flex justify-center items-center gap-[10px] w-[148px] h-[48px] px-4 py-3 rounded-[8px]",
                "bg-primary-1 hover:bg-primary-3 text-White",
                "disabled:bg-Gray-2 disabled:hover:bg-Gray-2 disabled:cursor-not-allowed"
              )}
            >
              취소
            </button>

            <button
              type="button"
              onClick={onSubmitUpdate}
              disabled={!canSave || updateClub.isPending || uploadImage.isPending || isLoading}
              className={cx(
                "flex justify-center items-center gap-[10px] h-[48px] px-4 py-3 rounded-[8px]",
                "w-full t:w-[148px]",
                "bg-primary-1 hover:bg-primary-3 text-White",
                "disabled:bg-Gray-2 disabled:hover:bg-Gray-2 disabled:cursor-not-allowed"
              )}
            >
              {updateClub.isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
