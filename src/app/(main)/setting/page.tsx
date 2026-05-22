import type { Metadata } from "next";
import SettingsPageClient from "./SettingsPageClient";

export const metadata: Metadata = {};

export default function SettingsPage() {
  return <SettingsPageClient />;
}
