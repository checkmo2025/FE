// src/components/base-ui/Settings/SocialLoginCard.tsx
import Image from "next/image";

type Props = {
  provider: "kakao" | "google" | "naver"; // 확장성을 위해 타입 정의
  email: string;
};

const PROVIDER_STYLES = {
  kakao: {
    bgColor: "bg-[#FAE100]",
    icon: "/kakaoImage.svg",
  },
  // 추후 google, naver 등 추가 가능
  google: { bgColor: "bg-white border border-Gray-2", icon: "/google.svg" },
  naver: { bgColor: "bg-[#03C75A]", icon: "/naver.svg" },
};

export default function SocialLoginCard({ provider, email }: Props) {
  const { bgColor, icon } = PROVIDER_STYLES[provider] || PROVIDER_STYLES.kakao;

  return (
    <div
      className={`flex w-[420px] h-[64px] items-center gap-[77px] rounded-[8px] px-[20px] ${bgColor}`}
    >
      {/* 아이콘 이미지 */}
      <div className="relative h-[42.56px] w-[42.56px] shrink-0">
        <Image
          src={icon}
          alt={`${provider} login`}
          fill
          className="rounded-full"
        />
      </div>

      {/* 이메일 텍스트 */}
      <span className="subhead_4_1 text-Gray-7">{email}</span>
    </div>
  );
}
