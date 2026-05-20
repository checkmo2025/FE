import type { Metadata } from "next";
import { Suspense } from "react";
import NicknameFollowsClient from "./NicknameFollowsClient";

export const metadata: Metadata = {
  title: "구독",
};

export default function OtherUserFollowsPage() {
  return (
    <Suspense>
      <NicknameFollowsClient />
    </Suspense>
  );
}
