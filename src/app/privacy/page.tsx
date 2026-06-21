import type { Metadata } from "next";
import {
  DocumentList,
  DocumentSection,
  PublicDocumentLayout,
} from "@/components/base-ui/PublicDocument/PublicDocumentLayout";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "책모 개인정보처리방침입니다. 개인정보 수집 항목, 이용 목적, 보관 및 파기, 이용자 권리를 안내합니다.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "책모 개인정보처리방침",
    description:
      "책모 개인정보처리방침입니다. 개인정보 수집 항목, 이용 목적, 보관 및 파기, 이용자 권리를 안내합니다.",
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <PublicDocumentLayout title="개인정보처리방침" effectiveDate="2026년 6월 5일">
      <DocumentSection title="1. 수집하는 개인정보 항목">
        <DocumentList
          items={[
            "회원가입/로그인: 이메일, 비밀번호, 닉네임, 이름, 휴대폰 번호",
            "프로필 설정: 프로필 이미지, 소개글, 독서 관심 카테고리",
            "서비스 이용: 책이야기, 댓글, 모임 생성/참여/신청 내용, 신고/차단 내역",
            "자동 생성: 접속 기록, 서비스 이용 기록, 기기 정보, 오류 로그",
          ]}
        />
      </DocumentSection>

      <DocumentSection title="2. 개인정보 이용 목적">
        <DocumentList
          items={[
            "회원 식별 및 로그인",
            "독서모임/책이야기 서비스 제공",
            "사용자 간 구독, 신고, 차단 기능 제공",
            "부정 이용 방지 및 서비스 안정화",
            "고객 문의 응대",
          ]}
        />
      </DocumentSection>

      <DocumentSection title="3. 보관 및 파기">
        <DocumentList
          items={[
            "회원 탈퇴 시 개인정보를 지체 없이 파기합니다.",
            "법령 또는 분쟁 대응을 위해 필요한 정보는 일정 기간 보관할 수 있습니다.",
            "신고/차단/운영 기록은 서비스 안전 및 분쟁 대응을 위해 일정 기간 보관할 수 있습니다.",
          ]}
        />
      </DocumentSection>

      <DocumentSection title="4. 제3자 제공">
        <DocumentList
          items={[
            "책모는 원칙적으로 개인정보를 제3자에게 제공하지 않습니다.",
            "법령에 따른 요청이 있는 경우에는 예외적으로 제공할 수 있습니다.",
          ]}
        />
      </DocumentSection>

      <DocumentSection title="5. 처리 위탁">
        <p>
          책모는 서버/호스팅, 이메일 발송, 이미지 저장 등 서비스 운영에
          필요한 외부 서비스를 사용할 수 있습니다. 위탁이 필요한 경우 개인정보가
          안전하게 처리되도록 관리합니다.
        </p>
      </DocumentSection>

      <DocumentSection title="6. 이용자의 권리">
        <DocumentList
          items={[
            "이용자는 개인정보 조회, 수정, 삭제, 탈퇴를 요청할 수 있습니다.",
            "권리 행사는 문의 이메일(checkmo2025@gmail.com)로 요청할 수 있습니다.",
          ]}
        />
      </DocumentSection>

      <DocumentSection title="7. 개인정보 보호 문의">
        <p>책모 운영팀</p>
        <p>
          이메일:{" "}
          <a className="font-semibold text-primary-3" href="mailto:checkmo2025@gmail.com">
            checkmo2025@gmail.com
          </a>
        </p>
      </DocumentSection>
    </PublicDocumentLayout>
  );
}

