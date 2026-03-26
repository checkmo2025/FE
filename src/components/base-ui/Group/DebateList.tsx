"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import LongtermChatInput from "@/components/base-ui/LongtermInput";
import BookshelfDeleteConfirmModal from "@/components/base-ui/Bookcase/bookid/BookshelfDeleteConfirmModal";
import ItemMoreMenu from "../Bookcase/ItemMoreMenu";

export type DebateItem = {
  id: number | string;
  name: string;
  content: string;
  profileImageUrl?: string | null;
  isAuthor?: boolean;
};

type Props = {
  items: DebateItem[];
  isStaff: boolean;

  onReport: (id: DebateItem["id"]) => void;
  onUpdate: (id: DebateItem["id"], nextContent: string) => void;
  onDelete: (id: DebateItem["id"]) => void;

  onClickAuthor?: (name: string) => void;
};

const DEFAULT_PROFILE = "/profile4.svg";

export default function DebateList({
  items,
  isStaff,
  onReport,
  onUpdate,
  onDelete,
  onClickAuthor,
}: Props) {
  const [editingId, setEditingId] = useState<DebateItem["id"] | null>(null);
  const [draftText, setDraftText] = useState("");

  const [deleteTargetId, setDeleteTargetId] = useState<DebateItem["id"] | null>(null);

  const editingItem = useMemo(() => {
    if (editingId == null) return null;
    return items.find((x) => String(x.id) === String(editingId)) ?? null;
  }, [editingId, items]);

  const startEdit = (item: DebateItem) => {
    setEditingId(item.id);
    setDraftText(item.content ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftText("");
  };

  useEffect(() => {
    if (editingId == null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancelEdit();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editingId]);

  const openDelete = (id: DebateItem["id"]) => setDeleteTargetId(id);
  const closeDelete = () => setDeleteTargetId(null);
  const confirmDelete = () => {
    if (deleteTargetId == null) return;
    onDelete(deleteTargetId);
    closeDelete();
  };

  return (
    <>
      <BookshelfDeleteConfirmModal
        isOpen={deleteTargetId != null}
        isPending={false}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        title="정말로 삭제하겠습니까?"
        description="삭제하면 복구할 수 없습니다."
        confirmText="예"
        cancelText="아니요"
      />

      <div className="w-full flex flex-col gap-[6px]">
        {items.map((item) => {
          const profileSrc = item.profileImageUrl || DEFAULT_PROFILE;
          const canManage = !!isStaff || !!item.isAuthor;
          const isEditing = editingId != null && String(editingId) === String(item.id);

          return (
            <div
              key={item.id}
              className="w-full flex flex-col rounded-[8px] border border-Subbrown-4 bg-White px-5 py-3 transition-[filter,transform,opacity] duration-150 ease-out"
            >
              {/* Mobile */}
              <div className="grid grid-cols-[1fr_auto] items-start gap-x-3 t:hidden">
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => onClickAuthor?.(item.name)}
                    className="flex items-center gap-3 hover:brightness-95 cursor-pointer text-left"
                  >
                    <Image src={profileSrc} alt="" width={28} height={28} className="rounded-full object-cover w-[24px] h-[24px]" />
                    <p className="text-Gray-7 body_1_2 truncate min-w-0">{item.name}</p>
                  </button>

                  {!isEditing ? (
                    <p className="mt-2 text-Gray-6 body_2_3 break-words whitespace-pre-wrap">
                      {item.content}
                    </p>
                  ) : (
                    <div className="mt-2">
                      <LongtermChatInput
                        initialValue={draftText}
                        placeholder="발제를 수정해 주세요"
                        buttonIconSrc="/Send.svg"
                        onSend={(text) => {
                          setDraftText(text);
                          onUpdate(item.id, text);
                          cancelEdit();
                          return true;
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="justify-self-end self-start">
                  {!isEditing && (
                    <ItemMoreMenu
                      canManage={canManage}
                      canReport={!canManage}
                      onReport={() => onReport(item.id)}
                      onEdit={() => startEdit(item)}
                      onDelete={() => openDelete(item.id)}
                    />
                  )}
                </div>
              </div>

              {/* Tablet+ */}
              <div className="hidden t:flex t:items-start t:gap-3">
                <button
                  type="button"
                  onClick={() => onClickAuthor?.(item.name)}
                  className="flex shrink-0 items-center gap-3 t:min-w-[150px] d:min-w-[200px] hover:brightness-95 cursor-pointer text-left"
                >
                  <Image
                    src={profileSrc}
                    alt=""
                    width={28}
                    height={28}
                    className="rounded-full object-cover w-[28px] h-[28px] d:w-[40px] d:h-[40px]"
                  />
                  <p className="text-Gray-7 body_1_2 d:subhead_4_1 truncate">{item.name}</p>
                </button>

                <div className="min-w-0 flex-1 flex items-center min-h-[40px]">
                  {!isEditing ? (
                    <p className="text-Gray-6 body_2_3 d:body_1_2 break-words whitespace-pre-wrap justifys-center">
                      {item.content}
                    </p>
                  ) : (
                    <>
                      <LongtermChatInput
                        initialValue={draftText}
                        placeholder="발제를 수정해 주세요"
                        buttonIconSrc="/Send.svg"
                        onSend={(text) => {
                          setDraftText(text);
                          onUpdate(item.id, text);
                          cancelEdit();
                          return true;
                        }}
                      />
                    </>
                  )}
                </div>

                {!isEditing && (
                  <ItemMoreMenu
                    canManage={canManage}
                    canReport={!canManage}
                    onReport={() => onReport(item.id)}
                    onEdit={() => startEdit(item)}
                    onDelete={() => openDelete(item.id)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}