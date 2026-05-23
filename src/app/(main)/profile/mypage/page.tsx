import type { Metadata } from "next";
import { Suspense } from "react";
import MypageClient from "./MypageClient";

export const metadata: Metadata = {
  title: "마이페이지",
};

export default function MyPage() {
  return (
    <Suspense>
      <MypageClient />
    </Suspense>
  );
}
