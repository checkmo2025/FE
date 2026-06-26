import type { Metadata } from "next";
import {
  DocumentList,
  DocumentSection,
  PublicDocumentLayout,
} from "@/components/base-ui/PublicDocument/PublicDocumentLayout";
import { MARKETING_DATA } from "@/constants/setting/marketing";

export const metadata: Metadata = {
  title: "마케팅 및 이벤트 정보 수신 동의",
  description: "책모의 다양한 혜택과 이벤트 소식을 받아보세요.",
  alternates: {
    canonical: "/marketing-consent",
  },
  openGraph: {
    title: "책모 마케팅 및 이벤트 정보 수신 동의",
    description: "책모의 다양한 혜택과 이벤트 소식을 받아보세요.",
    url: "/marketing-consent",
  },
};

export default function MarketingConsentPage() {
  return (
    <PublicDocumentLayout title="마케팅 및 이벤트 정보 수신 동의">
      {MARKETING_DATA.map((term) => (
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
