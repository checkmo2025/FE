import { useState } from "react";

export const useProfileSetup = () => {
  const [nickname, setNickname] = useState("");
  const [intro, setIntro] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleIntroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntro(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleCheckDuplicate = () => {
    console.log("Check duplicate nickname:", nickname);
  };

  const isValid =
    nickname !== "" && intro !== "" && name !== "" && phone !== "";

  return {
    nickname,
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
