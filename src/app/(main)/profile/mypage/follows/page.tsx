import type { Metadata } from "next";
import { Suspense } from "react";
import MypageFollowsClient from "./MypageFollowsClient";

export const metadata: Metadata = {
  title: "구독",
};

export default function FollowsPage() {
  return (
    <Suspense>
      <MypageFollowsClient />
    </Suspense>
  );
}
