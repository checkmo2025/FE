"use client";

import SettingsInputGroup from "@/components/base-ui/Settings/SettingsInputGroup";
import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";
import { useState } from "react";
import toast from "react-hot-toast";
import { useUpdatePasswordMutation } from "@/hooks/mutations/useMemberMutations";

export default function PasswordChangePage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate: updatePassword, isPending } = useUpdatePasswordMutation();

  const handleSave = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("모든 필드를 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{6,12}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error("비밀번호는 영문자, 특수문자를 포함하여 6~12자여야 합니다.");
      return;
    }

    updatePassword(
      { currentPassword, newPassword, confirmPassword },
      {
        onSuccess: () => {
          toast.success("비밀번호가 성공적으로 변경되었습니다.");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (error: any) => {
          // Check backend error response format if available, otherwise generic
          toast.error(error.message || "비밀번호 변경에 실패했습니다. 올바른 기존 비밀번호인지 확인하세요.");
        },
      }
    );
  };

  const buttonStyle =
    "flex h-[48px] items-center justify-center gap-[10px] rounded-[8px] bg-primary-1 px-[16px] py-[12px] w-[120px] md:w-[200px] disabled:opacity-50";
  const buttonTextStyle = "body_1_1 text-White";
  const inputContainerClass =
    "flex h-[52px] w-full items-center gap-[10px] rounded-[8px] border border-Subbrown-4 bg-White px-[16px] py-[12px]";

  return (
    <SettingsDetailLayout title="비밀번호 변경" className="gap-[40px]">
      <div className="flex flex-col items-end gap-[24px] self-stretch w-full">
        <div className="flex flex-col items-start gap-[20px] self-stretch w-full">
          <SettingsInputGroup
            label="기존 비밀번호"
            placeholder="기존 비밀번호를 입력해주세요"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <div className="flex flex-col items-start gap-[8px] self-stretch w-full">
            <SettingsInputGroup
              label="새 비밀번호"
              placeholder="새 비밀번호를 입력해주세요"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {/* 비밀번호 확인 인풋 */}
            <div className={inputContainerClass}>
              <input
                type="password"
                className="w-full bg-transparent outline-none body_1_3 text-Gray-7 placeholder:text-Gray-3"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          className={buttonStyle}
          onClick={handleSave}
          disabled={isPending}
        >
          <span className={buttonTextStyle}>
            {isPending ? "변경 중..." : "변경하기"}
          </span>
        </button>
      </div>
    </SettingsDetailLayout>
  );
}
