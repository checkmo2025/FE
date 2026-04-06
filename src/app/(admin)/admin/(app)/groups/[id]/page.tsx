"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import TopSection from "@/components/base-ui/Admin/groups/TopItem";
import Category from "@/components/base-ui/Admin/groups/Category";
import Target from "@/components/base-ui/Admin/groups/Target";
import {
  fetchAdminClubDetail,
  updateAdminClub,
  type AdminClubDetail,
  type UpdateAdminClubRequest,
} from "@/lib/api/admin/clubs";

const CATEGORY_OPTIONS = [
  { label: "여행", value: "TRAVEL" },
  { label: "외국어", value: "FOREIGN_LANGUAGE" },
  { label: "어린이/청소년", value: "CHILDREN_BOOKS" },
  { label: "종교/철학", value: "RELIGION_PHILOSOPHY" },
  { label: "소설/시/희곡", value: "FICTION_POETRY_DRAMA" },
  { label: "에세이", value: "ESSAY" },
  { label: "인문학", value: "HUMANITIES" },
  { label: "과학", value: "SCIENCE" },
  { label: "컴퓨터/IT", value: "COMPUTER_IT" },
  { label: "경제/경영", value: "ECONOMY_MANAGEMENT" },
  { label: "자기계발", value: "SELF_DEVELOPMENT" },
  { label: "사회과학", value: "SOCIAL_SCIENCE" },
  { label: "정치/외교/국방", value: "POLITICS_DIPLOMACY_DEFENSE" },
  { label: "역사/문화", value: "HISTORY_CULTURE" },
  { label: "예술/대중문화", value: "ART_POP_CULTURE" },
];

const TARGET_OPTIONS = [
  { label: "대학생", value: "STUDENT" },
  { label: "직장인", value: "WORKER" },
  { label: "온라인", value: "ONLINE" },
  { label: "동아리", value: "CLUB" },
  { label: "모임", value: "MEETING" },
  { label: "대면", value: "OFFLINE" },
];

function normalizeClubToForm(data: AdminClubDetail): UpdateAdminClubRequest {
  return {
    name: data.name ?? "",
    description: data.description ?? "",
    profileImageUrl: data.profileImageUrl ?? "",
    open: data.open ?? true,
    region: data.region ?? "",
    category: (data.category ?? []).map((item) => item.code),
    participantTypes: (data.participantTypes ?? []).map((item) => item.code),
    links: (data.links ?? []).map((item) => ({
      label: item.label ?? "",
      link: item.link ?? "",
    })),
  };
}

function normalizeForCompare(form: UpdateAdminClubRequest) {
  return {
    ...form,
    name: form.name.trim(),
    description: form.description.trim(),
    profileImageUrl: form.profileImageUrl.trim(),
    region: form.region.trim(),
    category: [...form.category].sort(),
    participantTypes: [...form.participantTypes].sort(),
    links: form.links.map((item) => ({
      label: item.label.trim(),
      link: item.link.trim(),
    })),
  };
}

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const groupId = Number(rawId);

  const [group, setGroup] = useState<AdminClubDetail | null>(null);
  const [form, setForm] = useState<UpdateAdminClubRequest | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (Number.isNaN(groupId)) {
      setError("올바르지 않은 모임 ID입니다.");
      setLoading(false);
      return;
    }

    const loadGroupDetail = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccessMessage("");

        const data = await fetchAdminClubDetail(groupId);
        setGroup(data);
        setForm(normalizeClubToForm(data));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "모임 상세정보 불러오기 실패",
        );
      } finally {
        setLoading(false);
      }
    };

    loadGroupDetail();
  }, [groupId]);

  const categories = useMemo(() => {
    if (!form) return [];

    return CATEGORY_OPTIONS.map((item) => ({
      label: item.label,
      selected: form.category.includes(item.value),
    }));
  }, [form]);

  const targets = useMemo(() => {
    if (!form) return [];

    return TARGET_OPTIONS.map((item) => ({
      label: item.label,
      selected: form.participantTypes.includes(item.value),
    }));
  }, [form]);

  const isValid = useMemo(() => {
    if (!form) return false;

    if (!form.name.trim()) return false;
    if (!form.description.trim()) return false;
    if (!form.region.trim()) return false;

    const hasInvalidLink = form.links.some(
      (item) =>
        (item.label.trim() !== "" && item.link.trim() === "") ||
        (item.label.trim() === "" && item.link.trim() !== ""),
    );

    return !hasInvalidLink;
  }, [form]);

  const isChanged = useMemo(() => {
    if (!group || !form) return false;

    const initialForm = normalizeClubToForm(group);

    return (
      JSON.stringify(normalizeForCompare(initialForm)) !==
      JSON.stringify(normalizeForCompare(form))
    );
  }, [group, form]);

  const handleToggleCategory = (value: string) => {
    setForm((prev) => {
      if (!prev) return prev;

      const exists = prev.category.includes(value);

      return {
        ...prev,
        category: exists
          ? prev.category.filter((item) => item !== value)
          : [...prev.category, value],
      };
    });
    setSuccessMessage("");
  };

  const handleToggleTarget = (value: string) => {
    setForm((prev) => {
      if (!prev) return prev;

      const exists = prev.participantTypes.includes(value);

      return {
        ...prev,
        participantTypes: exists
          ? prev.participantTypes.filter((item) => item !== value)
          : [...prev.participantTypes, value],
      };
    });
    setSuccessMessage("");
  };

  const handleRegionChange = (value: string) => {
    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        region: value,
      };
    });
    setSuccessMessage("");
  };

  const handleLinkChange = (
    index: number,
    key: "label" | "link",
    value: string,
  ) => {
    setForm((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        links: prev.links.map((item, i) =>
          i === index ? { ...item, [key]: value } : item,
        ),
      };
    });
    setSuccessMessage("");
  };

  const handleAddLink = () => {
    setForm((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        links: [...prev.links, { label: "", link: "" }],
      };
    });
    setSuccessMessage("");
  };

  const handleSave = async () => {
    if (!form || !isValid || !isChanged) return;

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const payload: UpdateAdminClubRequest = {
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
        profileImageUrl: form.profileImageUrl.trim(),
        region: form.region.trim(),
        links: form.links
          .map((item) => ({
            label: item.label.trim(),
            link: item.link.trim(),
          }))
          .filter((item) => item.label !== "" && item.link !== ""),
      };

      await updateAdminClub(groupId, payload);
      router.refresh();
      setSuccessMessage("모임 정보가 저장되었습니다.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "모임 수정에 실패했습니다.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="w-full flex justify-center">
        <div className="w-[1040px] pt-6 pb-10 text-Gray-7 body_1_2">
          로딩 중...
        </div>
      </main>
    );
  }

  if (error || !group || !form) {
    return (
      <main className="w-full flex justify-center">
        <div className="w-[1040px] pt-6 pb-10">
          <div className="mb-4 text-red-500 body_1_2">
            {error || "모임 정보를 찾을 수 없습니다."}
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="body_1_2 text-Gray-7 underline underline-offset-2 hover:opacity-70"
          >
            뒤로가기
          </button>
        </div>
      </main>
    );
  }

  const links = form.links;

  return (
    <main className="w-full flex justify-center">
      <div className="w-[1040px] pt-6 pb-10">
        <div className="flex justify-end mb-2">
          <Link
            href={`/admin/groups/${group.clubId}/members`}
            className="flex items-center gap-2 text-Gray-5 text-[14px] leading-[135%] underline underline-offset-2 hover:opacity-70"
          >
            회원 관리
            <Image
              src="/AdminUser.svg"
              alt="회원 관리"
              width={24}
              height={24}
            />
          </Link>
        </div>

        <TopSection
          groupId={group.clubId}
          name={form.name}
          intro={form.description ?? undefined}
          coverImgSrc={form.profileImageUrl ?? undefined}
        />

        <div className="mt-14">
          <Category
            items={categories}
            onToggle={(label) => {
              const found = CATEGORY_OPTIONS.find((item) => item.label === label);
              if (!found) return;
              handleToggleCategory(found.value);
            }}
          />
        </div>

        <div className="mt-14">
          <h2 className="text-Gray-7 text-[18px] subhead_2 leading-[135%] tracking-[-0.018px] mb-3">
            활동 지역
          </h2>

          <div className="w-full h-[48px] rounded-[8px] border border-Subbrown-4 bg-White px-4 flex items-center">
            <input
              type="text"
              value={form.region}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="w-full text-Gray-7 text-[18px] font-normal leading-[135%] tracking-[-0.018px] outline-none bg-transparent"
            />
          </div>
        </div>

        <div className="mt-14">
          <Target
            items={targets}
            onToggle={(label) => {
              const found = TARGET_OPTIONS.find((item) => item.label === label);
              if (!found) return;
              handleToggleTarget(found.value);
            }}
          />
        </div>

        <div className="mt-14">
          <h2 className="text-Gray-7 text-[18px] subhead_2 leading-[135%] tracking-[-0.018px] mb-3">
            링크
          </h2>

          {links.length > 0 ? (
            <div className="flex flex-col gap-4">
              {links.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <input
                    type="text"
                    value={item.label ?? ""}
                    onChange={(e) =>
                      handleLinkChange(index, "label", e.target.value)
                    }
                    placeholder="링크 대체 텍스트 입력(최대 20자)"
                    className="flex-1 h-[56px] rounded-[8px] border border-Subbrown-4 bg-White px-4 text-[18px] outline-none"
                  />
                  <input
                    type="text"
                    value={item.link}
                    onChange={(e) =>
                      handleLinkChange(index, "link", e.target.value)
                    }
                    placeholder="링크 입력(최대 100자)"
                    className="flex-1 h-[56px] rounded-[8px] border border-Subbrown-4 bg-White px-4 text-[18px] outline-none"
                  />
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-4">
            <button
              type="button"
              onClick={handleAddLink}
              className="w-full h-[56px] rounded-[8px] bg-Gray-1 flex items-center justify-center text-[24px] text-Gray-5"
            >
              +
            </button>
          </div>

          {error ? (
            <p className="mt-4 text-red-500 body_1_2">{error}</p>
          ) : null}

          {successMessage ? (
            <p className="mt-4 text-green-600 body_1_2">{successMessage}</p>
          ) : null}

          <div className="mt-20 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={!isValid || !isChanged || saving}
              className={`w-[148px] h-[48px] rounded-[8px] text-White text-[16px] font-normal leading-[135%] tracking-[-0.016px] ${
                !isValid || !isChanged || saving
                  ? "bg-Gray-4 cursor-not-allowed"
                  : "bg-[var(--Primary_1)]"
              }`}
            >
              {saving ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}