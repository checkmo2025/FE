import type { Metadata } from "next";
import { PublicDocumentLayout } from "@/components/base-ui/PublicDocument/PublicDocumentLayout";
import TermsMarkdown from "@/components/common/TermsMarkdown";
import { TERMS_CONTENT } from "@/constants/signupTerms";

export const metadata: Metadata = {
  title: "개인정보 제3자 제공 동의",
  description:
    "책모 개인정보 제3자 제공 동의 안내입니다. 제3자 제공 여부와 동의 거부 권리를 안내합니다.",
  alternates: {
    canonical: "/third-party-consent",
  },
  openGraph: {
    title: "책모 개인정보 제3자 제공 동의",
    description:
      "책모 개인정보 제3자 제공 동의 안내입니다. 제3자 제공 여부와 동의 거부 권리를 안내합니다.",
    url: "/third-party-consent",
  },
};

export default function ThirdPartyConsentPage() {
  return (
    <PublicDocumentLayout title="개인정보 제3자 제공 동의">
      <TermsMarkdown content={TERMS_CONTENT.thirdParty.content} />
    </PublicDocumentLayout>
  );
}
