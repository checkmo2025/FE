import React from "react";
import JoinHeader from "./JoinHeader";
import { useSignup } from "@/contexts/SignupContext";

interface JoinLayoutProps {
  children: React.ReactNode;
  title?: string;
  desktopGap?: string;
}

const JoinLayout: React.FC<JoinLayoutProps> = ({
  children,
  title,
  desktopGap = "t:gap-[100px]",
}) => {
  const { toast } = useSignup();

  return (
    <div
      className={`relative flex flex-col items-center mx-auto bg-white shadow-lg rounded-[8px] w-[352px] h-[650px] px-[24px] py-[40px] gap-[40px] t:w-[700px] t:h-[1004px] t:px-[56px] t:py-[99px] ${desktopGap}`}
    >
      <JoinHeader title={title} />
      <div className="flex flex-col items-center w-full">{children}</div>

      {/* Global Toast Notification */}
      {toast && (
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] inline-flex justify-center items-center h-auto py-4 px-8 md:h-[88px] md:px-[138px] bg-[#31111D99] rounded-[24px] backdrop-blur-[1px] transition-opacity duration-300 ${toast.visible ? "opacity-100" : "opacity-0"
            }`}
        >
          <span className="text-white text-[16px] md:text-[18px] font-medium leading-[135%] tracking-[-0.018px] whitespace-nowrap">
            {toast.message}
          </span>
        </div>
      )}
    </div>
  );
};

export default JoinLayout;
