import Image from "next/image";

export default function LandingChatSection() {
  return (
    <section className="relative overflow-hidden bg-[#1a1008]">
      {/* 배경 이미지 */}
      <Image
        src="/landing/landing-seventh-background.svg"
        alt=""
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      <div className="relative z-10 flex flex-col items-center px-6 pt-20 pb-10 t:pt-24 t:pb-16 d:px-8">
        {/* 책 아이콘 */}
        <div className="mb-6 w-24 t:w-28">
          <Image
            src="/landing/landing-seventh-book.svg"
            alt="책"
            width={120}
            height={100}
            className="w-full"
          />
        </div>

        {/* 타이틀 */}
        <h2 className="subhead_1 mb-3 text-center text-white t:headline_3">
          독서 토론의 처음부터 끝까지!
        </h2>
        <p className="body_1_2 mb-16 text-center text-white/70">
          독서 토론의 처음부터 끝까지, 함께 읽는 경험을 더 풍부하게 만들어줘요.
        </p>

        {/* 화면 영역 */}
        <div className="relative mx-auto w-full max-w-[1100px]">
          {/* 좌측 앱 화면 (screen1) */}
          <div className="relative z-10 w-[52%] drop-shadow-2xl">
            <Image
              src="/landing/landing-seventh-screen1.svg"
              alt="책모 화면"
              width={600}
              height={400}
              className="w-full rounded-xl"
            />
            {/* 북 카드 오버레이 */}
            <div className="absolute bottom-[18%] left-[16%] w-[15%]">
              <Image
                src="/landing/landing-seventh-bookcard1.svg"
                alt="책 카드"
                width={520}
                height={160}
                className="w-full"
              />
            </div>
          </div>

          {/* 우측 팝업 화면 (screen2) + comment 스택 */}
          <div className="absolute right-0 top-[-20px] z-20 w-[62%] drop-shadow-2xl">
            <Image
              src="/landing/landing-seventh-screen2.svg"
              alt="한줄평 팝업"
              width={700}
              height={520}
              className="w-full rounded-xl"
            />
            {/* comment 차곡차곡 */}
            <div className="mt-2 flex flex-col gap-2">
              <Image src="/landing/landing-seventh-comment1.svg" alt="댓글 1" width={700} height={80} className="w-full" />
              <Image src="/landing/landing-seventh-comment2.svg" alt="댓글 2" width={700} height={80} className="w-full" />
              <Image src="/landing/landing-seventh-comment3.svg" alt="댓글 3" width={700} height={80} className="w-full" />
              <Image src="/landing/landing-seventh-comment4.svg" alt="댓글 4" width={700} height={80} className="w-full" />
            </div>
          </div>

          {/* 하단 좌측 텍스트 */}
          <div className="mt-8 w-[40%]">
            <h3 className="subhead_2 mb-2 text-white">한줄평 작성</h3>
            <p className="body_1_2 leading-relaxed text-white/70">
              책을 읽고 난 첫 감상을 별점과 함께 짧게 남겨보세요.
              <br />
              서로의 한줄평을 통해 같은 책을 다르게 읽은 시선을
              <br />
              발견할 수 있어요.
            </p>
          </div>
        </div>

        {/* 발제 작성 및 선택 섹션 */}
        <div className="mx-auto mt-32 flex w-full max-w-[1100px] items-center gap-12">
          {/* 좌측: screen3 + select 오버레이 */}
          <div className="relative w-[60%] shrink-0 drop-shadow-2xl">
            <Image
              src="/landing/landing-seventh-screen3.svg"
              alt="발제 화면"
              width={720}
              height={480}
              className="w-full rounded-xl"
            />
            {/* select1 오버레이 */}
            <div className="absolute left-[22%] top-[38%] w-[75%]">
              <Image
                src="/landing/landing-seventh-select1.svg"
                alt="발제 선택 1"
                width={400}
                height={48}
                className="w-full"
              />
            </div>
            {/* select2 오버레이 */}
            <div className="absolute left-[22%] top-[54%] w-[75%]">
              <Image
                src="/landing/landing-seventh-select2.svg"
                alt="발제 선택 2"
                width={400}
                height={48}
                className="w-full"
              />
            </div>
          </div>

          {/* 우측: 텍스트 */}
          <div className="flex flex-col gap-3">
            <h3 className="subhead_1 text-white t:headline_3">발제 작성 및 선택</h3>
            <p className="body_1_2 leading-relaxed text-white/70">
              토론을 이끌 질문을 직접 작성하고, 함께 이야기하고 싶은
              <br />
              발제를 선택해 보세요. 좋은 발제 하나가 모임의 대화를
              <br />
              더 깊고 풍성하게 만들어줘요.
            </p>
          </div>
        </div>

        {/* 채팅 기능 활용 섹션 */}
        <div className="mx-auto mt-32 w-full max-w-[1100px] pb-24">
          {/* 상단 텍스트 (좌측) */}
          <div className="mb-12 w-[45%]">
            <h3 className="subhead_1 mb-3 text-white t:headline_3">채팅 기능 활용</h3>
            <p className="body_1_2 leading-relaxed text-white/70">
              온·오프라인으로 조원들과 자유롭게 의견을 나눠보세요.
              <br />
              토론 전후의 생각까지 이어가며 독서 경험을 더 오래,
              <br />
              더 진하게 남길 수 있어요.
            </p>
          </div>

          {/* 화면 영역 */}
          <div className="relative h-[620px]">
            {/* 좌측: screen4 (채팅 조 선택 모달) */}
            <div className="absolute left-0 top-[18%] z-20 w-[32%] drop-shadow-2xl">
              <div className="relative">
                <Image
                  src="/landing/landing-seventh-screen4.svg"
                  alt="채팅 조 선택"
                  width={420}
                  height={460}
                  className="w-full rounded-xl"
                />
                {/* A조 버튼 위에 group1 오버레이 */}
                <div className="absolute left-[4%] top-[22%] w-[92%]">
                  <Image
                    src="/landing/landing-seventh-group1.svg"
                    alt="A조"
                    width={400}
                    height={48}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* A조 → screen5 점선 연결 */}
            <div
              className="absolute z-30"
              style={{
                left: "32%",
                top: "calc(18% + 120px)",
                width: "calc(58% - 32%)",
                borderTop: "2px dashed #C4A068",
              }}
            />

            {/* 우측: screen5 (채팅창) + chat 버블 + input */}
            <div className="absolute right-[4%] top-[-6%] z-10 w-[58%] drop-shadow-2xl">
              <div className="relative">
                <Image
                  src="/landing/landing-seventh-screen5.svg"
                  alt="채팅 화면"
                  width={740}
                  height={540}
                  className="w-full rounded-xl"
                />
                {/* chat1 - 왼쪽 (수신) */}
                <div className="absolute left-[3%] top-[13%] w-[58%]">
                  <Image src="/landing/landing-seventh-chat1.svg" alt="채팅 1" width={420} height={80} className="w-full" />
                </div>
                {/* chat2 - 오른쪽 (송신) */}
                <div className="absolute right-[3%] top-[36%] w-[58%]">
                  <Image src="/landing/landing-seventh-chat2.svg" alt="채팅 2" width={420} height={80} className="w-full" />
                </div>
                {/* chat3 - 오른쪽 (송신) */}
                <div className="absolute right-[3%] top-[55%] w-[58%]">
                  <Image src="/landing/landing-seventh-chat3.svg" alt="채팅 3" width={420} height={80} className="w-full" />
                </div>
                {/* chat4 - 왼쪽 (수신) */}
                <div className="absolute left-[3%] top-[74%] w-[58%]">
                  <Image src="/landing/landing-seventh-chat4.svg" alt="채팅 4" width={420} height={80} className="w-full" />
                </div>
                {/* 채팅 입력창 */}
                <div className="absolute bottom-[3%] left-[4%] w-[92%]">
                  <Image
                    src="/landing/landing-seventh-chat-input.svg"
                    alt="채팅 입력창"
                    width={680}
                    height={56}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
