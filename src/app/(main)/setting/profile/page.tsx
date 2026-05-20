import type { Metadata } from "next";
import ProfileEditPageClient from "./ProfileEditPageClient";

export const metadata: Metadata = {
  title: "설정",
};

export default function ProfileEditPage() {
  return <ProfileEditPageClient />;
}
