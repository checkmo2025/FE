import type { Metadata } from "next";
import { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";

export const metadata: Metadata = {
  title: "도서 검색",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageClient />
    </Suspense>
  );
}
