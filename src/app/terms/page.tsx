import type { Metadata } from "next";
import {
  DocumentSection,
  PublicDocumentLayout,
} from "@/components/base-ui/PublicDocument/PublicDocumentLayout";
import { TERMS_DATA } from "@/constants/setting/terms";

export const metadata: Metadata = {
  title: "이용약관",
  description: "책모 서비스 이용약관입니다.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "책모 이용약관",
    description: "책모 서비스 이용약관입니다.",
    url: "/terms",
  },
};

const terms = TERMS_DATA.map((term) =>
  term.title === "제 13조 (시행일)"
    ? { ...term, content: "본 약관은 2026년 6월 5일부터 시행합니다." }
    : term,
);

export default function TermsPage() {
  return (
    <PublicDocumentLayout title="책모 이용약관" effectiveDate="2026년 6월 5일">
      {terms.map((term) => (
        <DocumentSection key={term.title} title={term.title}>
          <div className="flex flex-col gap-2">
            {term.content.split("\n").map((line) => (
              <p key={line}>{line.trim()}</p>
            ))}
          </div>
        </DocumentSection>
      ))}
    </PublicDocumentLayout>
  );
}

