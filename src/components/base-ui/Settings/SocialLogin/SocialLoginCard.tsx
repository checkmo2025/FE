// src/components/base-ui/Settings/SocialLoginCard.tsx
import Image from "next/image";

import { LoginProvider } from "@/types/member";

type Props = {
  provider: Lowercase<LoginProvider>;
  email: string;
};

const PROVIDER_STYLES = {
  local: {
    bgColor: "bg-White border border-Gray-2",
    icon: "/profile10.svg",
  },
  kakao: {
    bgColor: "bg-[#FAE100]",
    icon: "/kakaoImage.svg",
  },
  // 추후 google, naver 등 추가 가능
  google: { bgColor: "bg-White border border-Gray-2", icon: "/googleLogo.svg" },
  naver: { bgColor: "bg-[#03C75A]", icon: "/naverLogo.svg" },
  apple: { bgColor: "bg-black text-white", icon: "/appleLogo.svg" },
};

export default function SocialLoginCard({ provider, email }: Props) {
  const { bgColor, icon } = PROVIDER_STYLES[provider] || PROVIDER_STYLES.kakao;

  return (
    <div
      className={`flex items-center gap-[20px] md:gap-[77px] rounded-[8px] px-[20px] h-[64px] ${bgColor}
      w-full max-w-[420px]`}
    >
      <div className="relative h-[42.56px] w-[42.56px] shrink-0">
        <Image
          src={icon}
          alt={`${provider} login`}
          fill
          className="rounded-full"
        />
      </div>

      <span className="truncate subhead_4_1 text-Gray-7">{email}</span>
    </div>
  );
}
