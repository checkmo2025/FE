import type { Metadata } from "next";
import ProfileEditPageClient from "./ProfileEditPageClient";

export const metadata: Metadata = {
  title: "프로필 수정",
};

export default function ProfileEditPage() {
  return <ProfileEditPageClient />;
}
