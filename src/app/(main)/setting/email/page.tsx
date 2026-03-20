"use client";

import SettingsInputGroup from "@/components/base-ui/Settings/SettingsInputGroup";
import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";
import { useState } from "react";
import { useVerifyEmailMutation } from "@/hooks/mutations/useAuthMutations";
import { useUpdateEmailMutation } from "@/hooks/mutations/useMemberMutations";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function EmailChangePage() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();

  const { mutate: verifyEmail, isPending: isVerifying } = useVerifyEmailMutation();
  const { mutate: updateEmail, isPending: isUpdating } = useUpdateEmailMutation();

  const handleSendVerification = () => {
    if (!newEmail.trim()) {
      toast.error("변경할 이메일을 입력해주세요.");
      return;
    }
    verifyEmail({ email: newEmail, type: "UPDATE_EMAIL" });
  };

  const handleChangeEmail = () => {
    if (!currentEmail.trim()) {
      toast.error("기존 이메일을 입력해주세요.");
      return;
    }
    if (!newEmail.trim()) {
      toast.error("변경할 이메일을 입력해주세요.");
      return;
    }
    if (!verificationCode.trim()) {
      toast.error("인증번호를 입력해주세요.");
      return;
    }

    updateEmail(
      { currentEmail, newEmail, verificationCode },
      {
        onSuccess: () => {
          router.push("/setting");
        },
      }
    );
  };

  const buttonStyle =
    "flex h-[48px] items-center justify-center gap-[10px] rounded-[8px] bg-Gray-1 px-[16px] py-[12px] w-[120px] md:w-[200px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-Gray-2";
  const buttonTextStyle = "body_1_1 text-Gray-4";

  return (
    <SettingsDetailLayout title="이메일 변경" className="gap-[40px]">
      {/* 섹션 1 */}
      <div className="flex flex-col items-end gap-[24px] self-stretch w-full">
        <div className="flex flex-col items-start gap-[20px] self-stretch w-full">
          <SettingsInputGroup
            label="기존 이메일"
            placeholder="기존 이메일을 입력해주세요"
            type="email"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
          />
          <SettingsInputGroup
            label="변경 이메일"
            placeholder="변경할 이메일을 입력해주세요"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>
        <button
          className={buttonStyle}
          onClick={handleSendVerification}
          disabled={isVerifying}
        >
          <span className={buttonTextStyle}>
            {isVerifying ? "발송 중..." : "인증번호 발송"}
          </span>
        </button>
      </div>

      {/* 섹션 2 */}
      <div className="flex flex-col items-end gap-[24px] self-stretch w-full">
        <SettingsInputGroup
          label="인증번호"
          placeholder="인증번호 입력"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <button
          className={buttonStyle}
          onClick={handleChangeEmail}
          disabled={isUpdating}
        >
          <span className={buttonTextStyle}>
            {isUpdating ? "변경 중..." : "변경하기"}
          </span>
        </button>
      </div>
    </SettingsDetailLayout>
  );
}
