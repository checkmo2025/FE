import type { Metadata } from "next";
import {
  DocumentList,
  DocumentSection,
  PublicDocumentLayout,
} from "@/components/base-ui/PublicDocument/PublicDocumentLayout";
import { THIRD_PARTY_DATA } from "@/constants/setting/thirdParty";

export const metadata: Metadata = {
  title: "개인정보 제3자 제공 동의",
  description: "책모 서비스 이용을 위한 개인정보 제3자 제공 동의서입니다.",
  alternates: {
    canonical: "/support/v1/third-party-consent",
  },
  openGraph: {
    title: "책모 개인정보 제3자 제공 동의",
    description: "책모 서비스 이용을 위한 개인정보 제3자 제공 동의서입니다.",
    url: "/support/v1/third-party-consent",
  },
};

export default function ThirdPartyConsentPage() {
  return (
    <PublicDocumentLayout
      title="개인정보 제3자 제공 동의"
      effectiveDate="2026년 7월 9일"
    >
      {THIRD_PARTY_DATA.map((term) => (
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
