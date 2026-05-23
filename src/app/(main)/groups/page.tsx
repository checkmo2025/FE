import type { Metadata } from "next";
import GroupsPageClient from "./GroupsPageClient";

export const metadata: Metadata = {
  title: "독서 모임 찾기",
  description: "취향에 맞는 독서 모임을 찾아보세요",
};

export default function GroupsPage() {
  return <GroupsPageClient />;
}
