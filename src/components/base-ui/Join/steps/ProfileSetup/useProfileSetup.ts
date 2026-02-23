import { useSignup } from "@/contexts/SignupContext";
import { authService } from "@/services/authService";
import { z } from "zod";

const profileSchema = z.object({
  nickname: z.string().min(1, "닉네임을 입력해주세요!"),
  isNicknameChecked: z.boolean().refine((val) => val === true, {
    message: "닉네임 중복확인을 해주세요!",
  }),
  intro: z.string().min(1, "소개를 입력해주세요!").max(40, "소개는 40자 이내로 작성해주세요."),
  name: z.string().min(1, "이름을 입력해주세요!"),
  phone: z.string().min(1, "전화번호를 입력해주세요!").regex(/^010-\d{3,4}-\d{4}$/, "올바른 전화번호 형식이 아닙니다."),
});

export const useProfileSetup = () => {
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
    // 닉네임 : 영어 소문자 및 특수문자, 숫자만 사용 가능, 최대 20글자
    const filteredValue = value.replace(/[^a-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, "").slice(0, 20);
    setNickname(filteredValue);
    setIsNicknameChecked(false);
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
    if (!nickname) return;

    try {
      const response = await authService.checkNickname(nickname);
      // Backend Spec: result: false (not duplicated/available), result: true (duplicated/taken)
      if (response.isSuccess && response.result === false) {
        setIsNicknameChecked(true);
        showToast("사용 가능한 닉네임입니다.");
      } else {
        showToast("이미 사용 중인 닉네임입니다.");
        setIsNicknameChecked(false);
      }
    } catch (error: any) {
      showToast(error.message || "닉네임 확인 중 오류가 발생했습니다.");
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

  const isNicknameValid = nickname.length > 0;

  return {
    nickname,
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

