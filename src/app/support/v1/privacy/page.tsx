import type { Metadata } from "next";
import {
  DocumentList,
  DocumentSection,
  PublicDocumentLayout,
} from "@/components/base-ui/PublicDocument/PublicDocumentLayout";
import { PRIVACY_DATA } from "@/constants/setting/privacy";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "책모 개인정보처리방침입니다. 개인정보 수집 항목, 이용 목적, 보관 및 파기, 이용자 권리를 안내합니다.",
  alternates: {
    canonical: "/support/v1/privacy",
  },
  openGraph: {
    title: "책모 개인정보처리방침",
    description:
      "책모 개인정보처리방침입니다. 개인정보 수집 항목, 이용 목적, 보관 및 파기, 이용자 권리를 안내합니다.",
    url: "/support/v1/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <PublicDocumentLayout title="개인정보처리방침" effectiveDate="2026년 7월 9일">
      {PRIVACY_DATA.map((term) => (
        <DocumentSection key={term.title} title={term.title}>
          {Array.isArray(term.content) ? (
            <DocumentList items={term.content} />
          ) : (
            <div className="flex flex-col gap-2">
              {term.content.split("\n").map((line, index) => (
                <p key={`${line.trim()}-${index}`}>{line.trim()}</p>
              ))}
            </div>
          )}
        </DocumentSection>
      ))}
    </PublicDocumentLayout>
  );
}
