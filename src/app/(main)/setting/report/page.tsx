import SettingsTitle from "@/components/base-ui/Settings/SettingsTitle";
import ReportItem from "@/components/base-ui/Settings/Report/ReportItem";

// UI 확인을 위한 Mock Data
const MOCK_REPORTS = [
  {
    id: 1,
    category: "일반",
    reporterName: "hy_0716",
    content:
      "아무 의미 없이 분량을 채우기 위해 작성된 글자 더미입니다. 이 문장은 특정한 정보를 전달하거나 메시지를 담고 있지 않으며, 오직 글의 길이와 흐름을 확인하기 위한 용도로 사용됩니다. 디자인 작업이나 편집 과정에서 실제 콘텐츠가 준비되기 전까지 임시로 배치하는 텍스트라고 생각하면 됩니다. 문장은 자연스럽게 이어지지만 내용은 중요하지 않고, 읽는 사람에게 특별한 해석을 요구하지 않습니다. 글자의 밀도, 줄 간격, 문단의 균형을 확인하는 데 적합하며 필요에 따라 자유롭게 수정하거나 삭제할 수 있습니다.",
  },
  {
    id: 2,
    category: "모임내부",
    reporterName: "book_lover",
    content: "지속적으로 광고성 댓글을 달고 있습니다. 확인 부탁드립니다.",
  },
  {
    id: 3,
    category: "댓글",
    reporterName: "reading_cat",
    content: "모임 채팅방에서 부적절한 언어를 사용했습니다.",
  },
  {
    id: 3,
    category: "책 이야기",
    reporterName: "reading_cat",
    content: "모임 채팅방에서 부적절한 언어를 사용했습니다.",
  },
];

export default function ReportPage() {
  return (
    <div className="flex w-[1152px] flex-col items-start gap-[24px] pb-[12px] px-[76px]">
      {/* 1. 타이틀 영역 */}
      <SettingsTitle title="신고 관리" />

      {/* 2. 신고 리스트 영역 */}
      <div className="flex flex-col items-start gap-[8px] self-stretch">
        {MOCK_REPORTS.map((report) => (
          <ReportItem
            key={report.id}
            category={report.category}
            reporterName={report.reporterName}
            content={report.content}
          />
        ))}
      </div>
    </div>
  );
}
