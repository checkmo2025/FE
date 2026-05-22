import type { Metadata } from "next";
import SettingsLayoutClient from "./SettingsLayoutClient";

export const metadata: Metadata = {
  title: {
    default: "설정",
    template: "%s | 설정",
  },
  robots: { index: false, follow: false },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <SettingsLayoutClient>{children}</SettingsLayoutClient>;
}
