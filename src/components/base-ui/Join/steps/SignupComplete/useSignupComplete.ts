import { useRouter } from "next/navigation";
import { useSignup } from "@/contexts/SignupContext";

export const useSignupComplete = () => {
  const router = useRouter();
  const { nickname, intro, profileImage } = useSignup();

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
    nickname: nickname || "닉네임",
    intro: intro || "안녕하세요~",
    profileImage: profileImage || "/default_profile_1.svg",
    handleSearchMeeting,
    handleCreateMeeting,
    handleUseWithoutMeeting,
  };
};
