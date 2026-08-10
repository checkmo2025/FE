import { useSignup } from "@/contexts/SignupContext";
import { authService } from "@/services/authService";
import { validateNickname } from "@/utils/nickname";
import { useState } from "react";
import { z } from "zod";

const profileSchema = z.object({
  nickname: z.string().superRefine((value, ctx) => {
    const validation = validateNickname(value);
    if (!validation.isValid) {
      ctx.addIssue({ code: "custom", message: validation.message });
    }
  }),
  isNicknameChecked: z.boolean().refine((val) => val === true, {
    message: "닉네임 중복확인을 해주세요!",
  }),
  intro: z.string().min(1, "소개를 입력해주세요!").max(40, "소개는 40자 이내로 작성해주세요."),
  name: z.string().min(1, "이름을 입력해주세요!"),
  phone: z.string().min(1, "전화번호를 입력해주세요!").regex(/^010-\d{3,4}-\d{4}$/, "올바른 전화번호 형식이 아닙니다."),
});

export const useProfileSetup = () => {
  const [nicknameInputError, setNicknameInputError] = useState("");
  const {
    nickname,
    setNickname,
    isNicknameChecked,
    setIsNicknameChecked,
    intro,
    setIntro,
    name,
    setName,
    phone,
    setPhone,
    showToast,
  } = useSignup();

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const validation = validateNickname(value);

    setNickname(value);
    setNicknameInputError(value.length > 0 && !validation.isValid ? validation.message : "");
    if (value !== nickname) {
      setIsNicknameChecked(false);
    }
  };

  const handleIntroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntro(e.target.value.slice(0, 40)); // 최대 40자
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.slice(0, 10)); // 10자 제한
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
    let formatted = value;
    if (value.length <= 3) {
      formatted = value;
    } else if (value.length <= 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else {
      formatted = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
    }

    setPhone(formatted);
  };

  const handleCheckDuplicate = async () => {
    const validation = validateNickname(nickname);
    if (!validation.isValid) {
      setNicknameInputError(validation.message);
      showToast(validation.message);
      return;
    }

    const normalizedNickname = validation.normalized;
    if (normalizedNickname !== nickname) {
      setNickname(normalizedNickname);
    }

    try {
      const response = await authService.checkNickname(normalizedNickname);
      // Backend Spec: result: false (not duplicated/available), result: true (duplicated/taken)
      if (response.isSuccess && response.result === false) {
        setIsNicknameChecked(true);
        showToast("사용 가능한 닉네임입니다.");
      } else {
        showToast("이미 사용 중인 닉네임입니다.");
        setIsNicknameChecked(false);
      }
    } catch (error: unknown) {
      showToast(error instanceof Error ? error.message : "닉네임 확인 중 오류가 발생했습니다.");
    }
  };

  const validate = () => {
    const result = profileSchema.safeParse({
      nickname,
      isNicknameChecked,
      intro,
      name,
      phone,
    });

    if (!result.success) {
      const firstError = result.error.issues[0];
      showToast(firstError.message);
      return { isValid: false, field: firstError.path[0] as string };
    }

    return { isValid: true };
  };

  const isNicknameValid = validateNickname(nickname).isValid;

  return {
    nickname,
    nicknameInputError,
    isNicknameChecked,
    isNicknameValid,
    intro,
    name,
    phone,
    handleNicknameChange,
    handleIntroChange,
    handleNameChange,
    handlePhoneChange,
    handleCheckDuplicate,
    validate,
  };
};
