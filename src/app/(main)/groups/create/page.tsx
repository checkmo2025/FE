import type { Metadata } from "next";
import CreateGroupPageClient from "./CreateGroupPageClient";

export const metadata: Metadata = {
  title: "모임 생성",
};

export default function CreateGroupPage() {
  return <CreateGroupPageClient />;
}
