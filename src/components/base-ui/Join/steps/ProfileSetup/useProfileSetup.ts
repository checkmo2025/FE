import { useSignup } from "@/contexts/SignupContext";

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
    const value = e.target.value.replace(/[^0-9]/g, "");
    let formatted = value;
    if (value.length < 4) {
      formatted = value;
    } else if (value.length < 8) {
      formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length <= 11) {
      formatted = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
    } else {
      formatted = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(
        7,
        11
      )}`;
    }

    setPhone(formatted);
  };

  const handleCheckDuplicate = () => {
    if (!nickname) return;

    // 더미 로직: 중복 확인 결과 표시
    console.log("Check duplicate nickname:", nickname);
    setIsNicknameChecked(true);
    showToast("사용 가능한 닉네임입니다.");
  };

  const isNicknameValid = nickname.length > 0;

  const isValid =
    nickname !== "" &&
    isNicknameChecked &&
    intro !== "" &&
    name !== "" &&
    phone !== "";

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
    isValid,
  };
};
