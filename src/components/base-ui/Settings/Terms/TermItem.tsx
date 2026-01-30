
type Props = {
    title: string;
    content: string;
  };
  
  export default function TermItem({ title, content }: Props) {
    return (
      <div className="flex flex-col items-start gap-[12px] self-stretch">
        {/* 조항 제목: Body_1.2, Gray_7 */}
        <h3 className="body_1_2 text-Gray-7">
          {title}
        </h3>
        
        {/* 조항 내용: Body_1.3, Gray_5 */}
        <p className="body_1_3 text-Gray-5 whitespace-pre-wrap">
          {content}
        </p>
      </div>
    );
  }