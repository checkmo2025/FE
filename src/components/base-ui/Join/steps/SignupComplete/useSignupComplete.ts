import { useRouter } from "next/navigation";

export const useSignupComplete = () => {
  const router = useRouter();

  // 더미 데이터
  const nickname = "닉네임";
  const intro = "안녕하세요~ 윤현일입니다.";
  const profileImage = "/profile.svg"; // 이미지가 없을 경우 /default_profile_1.svg 사용 권장

  const handleSearchMeeting = () => {
    console.log("Search Meeting clicked");
    // router.push('/meeting/search');
  };

  const handleCreateMeeting = () => {
    console.log("Create Meeting clicked");
    // router.push('/meeting/create');
  };

  const handleUseWithoutMeeting = () => {
    console.log("Use Without Meeting clicked");
    router.push("/");
  };

  return {
    nickname,
    intro,
    profileImage,
    handleSearchMeeting,
    handleCreateMeeting,
    handleUseWithoutMeeting,
  };
};
