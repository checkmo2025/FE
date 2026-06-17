import type { Metadata } from "next";
import { PublicDocumentLayout } from "@/components/base-ui/PublicDocument/PublicDocumentLayout";
import TermsMarkdown from "@/components/common/TermsMarkdown";
import { TERMS_CONTENT } from "@/constants/signupTerms";

export const metadata: Metadata = {
  title: "마케팅 및 이벤트 정보 수신 동의",
  description:
    "책모 마케팅 및 이벤트 정보 수신 동의 안내입니다. 수신 내용, 방법, 철회 방법을 안내합니다.",
  alternates: {
    canonical: "/marketing-consent",
  },
  openGraph: {
    title: "책모 마케팅 및 이벤트 정보 수신 동의",
    description:
      "책모 마케팅 및 이벤트 정보 수신 동의 안내입니다. 수신 내용, 방법, 철회 방법을 안내합니다.",
    url: "/marketing-consent",
  },
};

export default function MarketingConsentPage() {
  return (
    <PublicDocumentLayout title="마케팅 및 이벤트 정보 수신 동의">
      <TermsMarkdown content={TERMS_CONTENT.marketing.content} />
    </PublicDocumentLayout>
  );
}
