import type { Metadata } from "next";
import Link from "next/link";
import {
  DocumentList,
  DocumentSection,
  PublicDocumentLayout,
} from "@/components/base-ui/PublicDocument/PublicDocumentLayout";
import { EXTERNAL_LINKS } from "@/constants/links";

const POLICY_LINKS = [
  { href: "/support/v1/terms", label: "이용약관" },
  { href: "/support/v1/privacy", label: "개인정보처리방침" },
  { href: "/support/v1/third-party-consent", label: "개인정보 제3자 제공 동의" },
  { href: "/support/v1/marketing-consent", label: "마케팅 및 이벤트 정보 수신 동의" },
];

export const metadata: Metadata = {
  title: "고객지원",
  description:
    "책모 이용 중 문제가 있거나 문의가 필요한 경우 고객지원 이메일로 연락해 주세요.",
  alternates: {
    canonical: "/support",
  },
  openGraph: {
    title: "책모 고객지원",
    description:
      "책모 이용 중 문제가 있거나 문의가 필요한 경우 고객지원 이메일로 연락해 주세요.",
    url: "/support",
  },
};

const supportItems = [
  "계정/로그인",
  "책이야기/댓글",
  "독서모임",
  "신고/차단",
  "탈퇴/개인정보",
  "오류 제보",
];

export default function SupportPage() {
  return (
    <PublicDocumentLayout
      title="책모 고객지원"
      description="책모 이용 중 문제가 있거나 문의가 필요한 경우 아래 이메일로 연락을 주시거나, 구글폼을 작성해주세요."
    >
      <section className="rounded-[8px] border border-Subbrown-3 bg-White p-5 t:p-6">
        <p className="text-[14px] font-medium leading-[145%] text-Gray-4">
          문의 이메일
        </p>
        <a
          href="mailto:checkmo2025@gmail.com"
          className="mt-2 block break-all text-[20px] font-semibold leading-[145%] text-primary-3 t:text-[22px]"
        >
          checkmo2025@gmail.com
        </a>
        <p className="mt-4 text-[15px] leading-[170%] text-Gray-5">
          문의 접수 후 영업일 기준 2~3일 이내에 답변드립니다.
        </p>
        <a
          href={EXTERNAL_LINKS.INQUIRY_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-[8px] border border-Subbrown-3 bg-White px-4 py-3 font-semibold text-primary-3 transition-colors hover:border-primary-2"
        >
          구글폼 작성하기
        </a>
      </section>

      <DocumentSection title="문의 가능 항목">
        <DocumentList items={supportItems} />
      </DocumentSection>

      <section className="rounded-[8px] border border-Subbrown-3 bg-White p-5 t:p-6">
        <p className="text-[14px] font-medium leading-[145%] text-Gray-4">
          소식 업로드
        </p>
        <p className="mt-2 text-[20px] font-semibold leading-[145%] text-primary-3 t:text-[22px]">
          책모에 소식을 등록해보세요
        </p>
        <p className="mt-4 text-[15px] leading-[170%] text-Gray-5">
          독서 모임, 출판 행사, 책 관련 소식을 공유하고 싶다면 아래 폼을
          작성해주세요.
        </p>
        <p className="mt-2 text-[14px] leading-[170%] text-Gray-4">
          관리자가 승인 후 책모 소식에 올라가며, 문의 내용에 따라 추후 관리자가
          이메일로 연락드릴 수 있습니다.
        </p>
        <a
          href={EXTERNAL_LINKS.NEWS_FROM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-[8px] border border-Subbrown-3 bg-White px-4 py-3 font-semibold text-primary-3 transition-colors hover:border-primary-2"
        >
          소식 업로드 요청하기
        </a>
      </section>

      <DocumentSection title="관련 문서">
        <div className="flex flex-col gap-3 t:flex-row t:flex-wrap">
          {POLICY_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-[8px] border border-Subbrown-3 bg-White px-4 py-3 font-semibold text-primary-3 transition-colors hover:border-primary-2"
            >
              {label}
            </Link>
          ))}
        </div>
      </DocumentSection>
    </PublicDocumentLayout>
  );
}

