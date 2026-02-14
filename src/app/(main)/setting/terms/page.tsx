import SettingsDetailLayout from "@/components/base-ui/Settings/SettingsDetailLayout";
import TermItem from "@/components/base-ui/Settings/Terms/TermItem";
import { TERMS_DATA } from "@/constants/setting/terms";

export default function TermsPage() {
  return (
    <SettingsDetailLayout title="이용약관" className="gap-[40px]">
      <div className="flex flex-col items-start gap-[24px] self-stretch">
        {TERMS_DATA.map((term, index) => (
          <TermItem key={index} title={term.title} content={term.content} />
        ))}
      </div>
    </SettingsDetailLayout>
  );
}
