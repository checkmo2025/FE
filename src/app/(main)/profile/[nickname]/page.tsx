import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

type Props = { params: Promise<{ nickname: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { nickname: encodedNickname } = await params;
  const nickname = decodeURIComponent(encodedNickname);
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/${encodedNickname}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { title: `${nickname}의 프로필` };
    const data = await res.json();
    const member = data.result;
    return {
      title: `${member.nickname}의 프로필`,
      description: member.description,
      openGraph: {
        title: `${member.nickname}의 프로필`,
        description: member.description,
        images: member.profileImageUrl ? [member.profileImageUrl] : [],
      },
    };
  } catch {
    return { title: `${nickname}의 프로필` };
  }
}

export default async function OtherUserProfilePage({ params }: Props) {
  const { nickname: encodedNickname } = await params;
  return <ProfileClient encodedNickname={encodedNickname} />;
}
