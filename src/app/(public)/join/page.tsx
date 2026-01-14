// src/app/(public)/join/page.tsx
import JoinLayout from "@/components/base-ui/Join/JoinLayout";
import TermsOfService from "@/components/base-ui/Join/steps/TermsOfService";

const JoinPage = () => {
  return <JoinLayout>{<TermsOfService />}</JoinLayout>;
};

export default JoinPage;
