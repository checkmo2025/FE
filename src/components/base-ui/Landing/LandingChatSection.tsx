"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import FadeInSection from "./FadeInSection";

export default function LandingChatSection() {
  const router = useRouter();
  const { openLoginModal } = useAuthStore();

  const handleJoin = () => {
    openLoginModal();
    router.push("/home");
  };

  return (
    <section className="relative overflow-hidden bg-[#1a1008]">
      {/* 배경 이미지 */}
      <Image
        src="/landing/landing-sixth-background.svg"
        alt=""
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      <div className="relative z-10 flex flex-col items-center px-4 pt-20 pb-10 t:px-6 t:pt-24 t:pb-16 d:px-8">
        {/* 책 아이콘 + 타이틀 */}
        <FadeInSection className="flex flex-col items-center">
          <div className="mb-6 w-20 t:w-28">
            <Image src="/landing/landing-sixth-book.svg" alt="책" width={120} height={100} className="w-full" />
          </div>
          <h2 className="subhead_1 mb-3 text-center text-white d:headline_3">
            독서 토론의 처음부터 끝까지!
          </h2>
          <p className="body_1_2 mb-12 text-center text-white/70 t:mb-16">
            독서 토론의 처음부터 끝까지, 함께 읽는 경험을 더 풍부하게 만들어줘요.
          </p>
        </FadeInSection>

        {/* ── 한줄평 작성 ── */}

        {/* 모바일 */}
        <FadeInSection delay={0.1} className="w-full t:hidden">
          <div className="mb-6">
            <h3 className="subhead_1 mb-2 text-white">한줄평 작성</h3>
            <p className="body_1_2 leading-relaxed text-white/70">
              책을 읽고 난 첫 감상을 별점과 함께 짧게 남겨보세요.
              서로의 한줄평을 통해 같은 책을 다르게 읽은 시선을 발견할 수 있어요.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Image src="/landing/landing-sixth-screen1.svg" alt="한줄평 화면" width={600} height={400} className="w-full rounded-xl shadow-xl" />
            <Image src="/landing/landing-sixth-screen2.svg" alt="한줄평 팝업" width={700} height={520} className="w-full rounded-xl shadow-xl" />
            <div className="flex flex-col gap-2">
              <Image src="/landing/landing-sixth-comment1.svg" alt="댓글 1" width={700} height={80} className="w-full" />
              <Image src="/landing/landing-sixth-comment2.svg" alt="댓글 2" width={700} height={80} className="w-full" />
              <Image src="/landing/landing-sixth-comment3.svg" alt="댓글 3" width={700} height={80} className="w-full" />
              <Image src="/landing/landing-sixth-comment4.svg" alt="댓글 4" width={700} height={80} className="w-full" />
            </div>
          </div>
        </FadeInSection>

        {/* 태블릿+ */}
        <FadeInSection delay={0.1} className="relative mx-auto hidden w-full max-w-[1100px] t:block">
          <div className="relative z-10 w-[52%] drop-shadow-2xl">
            <Image
              src="/landing/landing-sixth-screen1.svg"
              alt="책모 화면"
              width={600}
              height={400}
              className="w-full rounded-xl"
            />
            <div className="absolute bottom-[18%] left-[16%] w-[15%]">
              <Image src="/landing/landing-sixth-bookcard1.svg" alt="책 카드" width={520} height={160} className="w-full" />
            </div>
          </div>
          <div className="absolute right-0 top-[-20px] z-20 w-[62%] drop-shadow-2xl">
            <Image src="/landing/landing-sixth-screen2.svg" alt="한줄평 팝업" width={700} height={520} className="w-full rounded-xl" />
            <div className="mt-2 flex flex-col gap-2">
              <Image src="/landing/landing-sixth-comment1.svg" alt="댓글 1" width={700} height={80} className="w-full" />
              <Image src="/landing/landing-sixth-comment2.svg" alt="댓글 2" width={700} height={80} className="w-full" />
              <Image src="/landing/landing-sixth-comment3.svg" alt="댓글 3" width={700} height={80} className="w-full" />
              <Image src="/landing/landing-sixth-comment4.svg" alt="댓글 4" width={700} height={80} className="w-full" />
            </div>
          </div>
          <div className="mt-8 w-[40%]">
            <h3 className="subhead_1 mb-2 text-white d:headline_3">한줄평 작성</h3>
            <p className="body_1_2 leading-relaxed text-white/70">
              책을 읽고 난 첫 감상을 별점과 함께 짧게 남겨보세요.
              <br />
              서로의 한줄평을 통해 같은 책을 다르게 읽은 시선을
              <br />
              발견할 수 있어요.
            </p>
          </div>
        </FadeInSection>

        {/* ── 발제 작성 및 선택 ── */}

        {/* 모바일 */}
        <FadeInSection delay={0.1} className="mt-16 w-full t:hidden">
          <div className="mb-6">
            <h3 className="subhead_1 mb-2 text-white">발제 작성 및 선택</h3>
            <p className="body_1_2 leading-relaxed text-white/70">
              토론을 이끌 질문을 직접 작성하고, 함께 이야기하고 싶은
              발제를 선택해 보세요. 좋은 발제 하나가 모임의 대화를 더 깊고 풍성하게 만들어줘요.
            </p>
          </div>
          <div className="relative drop-shadow-2xl">
            <Image src="/landing/landing-sixth-screen3.svg" alt="발제 화면" width={720} height={480} className="w-full rounded-xl" />
            <div className="absolute left-[22%] top-[38%] w-[75%]">
              <Image src="/landing/landing-sixth-select1.svg" alt="발제 선택 1" width={400} height={48} className="w-full" />
            </div>
            <div className="absolute left-[22%] top-[54%] w-[75%]">
              <Image src="/landing/landing-sixth-select2.svg" alt="발제 선택 2" width={400} height={48} className="w-full" />
            </div>
          </div>
        </FadeInSection>

        {/* 태블릿+ */}
        <FadeInSection delay={0.1} className="mx-auto mt-32 hidden w-full max-w-[1100px] items-center gap-12 t:flex">
          <div className="relative w-[60%] shrink-0 drop-shadow-2xl">
            <Image src="/landing/landing-sixth-screen3.svg" alt="발제 화면" width={720} height={480} className="w-full rounded-xl" />
            <div className="absolute left-[22%] top-[38%] w-[75%]">
              <Image src="/landing/landing-sixth-select1.svg" alt="발제 선택 1" width={400} height={48} className="w-full" />
            </div>
            <div className="absolute left-[22%] top-[54%] w-[75%]">
              <Image src="/landing/landing-sixth-select2.svg" alt="발제 선택 2" width={400} height={48} className="w-full" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="subhead_1 text-white d:headline_3">발제 작성 및 선택</h3>
            <p className="body_1_2 leading-relaxed text-white/70">
              토론을 이끌 질문을 직접 작성하고, 함께 이야기하고 싶은
              <br />
              발제를 선택해 보세요. 좋은 발제 하나가 모임의 대화를
              <br />
              더 깊고 풍성하게 만들어줘요.
            </p>
          </div>
        </FadeInSection>

        {/* ── 채팅 기능 활용 ── */}

        {/* 모바일 */}
        <FadeInSection delay={0.1} className="mt-16 w-full pb-16 t:hidden">
          <div className="mb-6">
            <h3 className="subhead_1 mb-2 text-white">채팅 기능 활용</h3>
            <p className="body_1_2 leading-relaxed text-white/70">
              온·오프라인으로 조원들과 자유롭게 의견을 나눠보세요.
              토론 전후의 생각까지 이어가며 독서 경험을 더 오래, 더 진하게 남길 수 있어요.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Image src="/landing/landing-sixth-screen4.svg" alt="채팅 조 선택" width={420} height={460} className="w-full rounded-xl shadow-xl" />
            {/* 채팅 UI */}
            <div className="overflow-hidden rounded-2xl bg-[#EAE5E2]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <span className="body_1_2 text-white/50">‹</span>
                <span className="body_1_1 text-white">A조</span>
                <span className="body_1_2 text-white/50">×</span>
              </div>
              <div className="flex flex-col gap-3 p-4">
                <div className="flex justify-start">
                  <div className="max-w-[85%] break-words rounded-2xl bg-[#dff2e1] px-3 py-2.5 body_2_2 text-Gray-7 shadow-sm">
                    다들 『채식주의자』 읽고 나서 영혜를 어떻게 느꼈어요? 저는 단순히 이상해진 인물이라기보다, 자기 방식으로 끝까지 거부를 드러낸 사람처럼 보였어요.
                    <div className="mt-1 text-right body_2_2 text-Gray-4">15:50</div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[85%] break-words rounded-2xl bg-[#f0ece8] px-3 py-2.5 body_2_2 text-Gray-7 shadow-sm">
                    저는 영혜가 끝까지 설명되지 않는 인물이라는 점이 오히려 중요하다고 느꼈어요. 독자가 영혜를 완전히 이해하지 못하게 하면서도, 왜 그 자리에 몰렸는지는 분명히 보이더라고요.
                    <div className="mt-1 text-right body_2_2 text-Gray-4">15:50</div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[85%] break-words rounded-2xl bg-[#f0ece8] px-3 py-2.5 body_2_2 text-Gray-7 shadow-sm">
                    특히 주변 인물들이 영혜를 바라보는 방식이 인상적이었어요. 누구도 영혜 자체를 보지 않고, 각자 자기 입장에서 해석하고 소비하려는 느낌이라서 더 선명하게 읽혔어요.
                    <div className="mt-1 text-right body_2_2 text-Gray-4">15:50</div>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[85%] break-words rounded-2xl bg-[#fce8e6] px-3 py-2.5 body_2_2 text-Gray-7 shadow-sm">
                    맞아요. 그래서 저는 이 소설이 영혜를 설명하는 이야기라기보다, 한 사람을 끝내 이해하지 못하는 사회와 관계를 보여주는 이야기처럼 느껴졌어요.
                    <div className="mt-1 text-right body_2_2 text-Gray-4">15:50</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full items-center rounded-full border border-[#C4A068] bg-white px-5 py-3 shadow-sm">
              <span className="body_1_1 flex-1 text-Gray-7">독서 토론의 처음부터 끝까지, 책모!</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M22 2L11 13" stroke="#C4A068" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#C4A068" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </FadeInSection>

        {/* 태블릿+ */}
        <FadeInSection delay={0.1} className="mx-auto mt-32 hidden w-full max-w-[1100px] pb-24 t:block">
          <div className="mb-12 w-[45%]">
            <h3 className="subhead_1 mb-3 text-white d:headline_3">채팅 기능 활용</h3>
            <p className="body_1_2 leading-relaxed text-white/70">
              온·오프라인으로 조원들과 자유롭게 의견을 나눠보세요.
              <br />
              토론 전후의 생각까지 이어가며 독서 경험을 더 오래,
              <br />
              더 진하게 남길 수 있어요.
            </p>
          </div>
          <div className="relative h-[620px]">
            {/* screen4 */}
            <div className="absolute left-0 top-[5%] z-20 w-[32%] drop-shadow-2xl">
              <div className="relative">
                <Image src="/landing/landing-sixth-screen4.svg" alt="채팅 조 선택" width={420} height={460} className="w-full rounded-xl" />
                <div className="absolute left-[4%] top-[22%] w-[92%]">
                  <Image src="/landing/landing-sixth-group1.svg" alt="A조" width={400} height={48} className="w-full" />
                </div>
              </div>
            </div>

            {/* 점선 */}
            <div
              className="absolute z-30"
              style={{
                left: "32%",
                top: "calc(5% + 120px)",
                width: "28%",
                borderTop: "2px dashed #C4A068",
              }}
            />

            {/* 채팅 UI */}
            <div className="absolute right-[4%] top-[-10%] z-10 w-[36%] drop-shadow-2xl">
              <div className="overflow-hidden rounded-2xl bg-[#EAE5E2]">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <span className="body_1_2 text-Gray-5">‹</span>
                  <span className="body_1_1 text-Gray-7">A조</span>
                  <span className="body_1_2 text-Gray-5">×</span>
                </div>
                <div className="flex flex-col gap-3 p-4">
                  <div className="flex justify-start">
                    <div className="max-w-[85%] break-words rounded-2xl bg-[#dff2e1] px-3 py-2.5 body_2_2 text-Gray-7 shadow-sm">
                      다들 『채식주의자』 읽고 나서 영혜를 어떻게 느꼈어요? 저는 단순히 이상해진 인물이라기보다, 자기 방식으로 끝까지 거부를 드러낸 사람처럼 보였어요.
                      <div className="mt-1 text-right body_2_2 text-Gray-4">15:50</div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[85%] break-words rounded-2xl bg-[#f0ece8] px-3 py-2.5 body_2_2 text-Gray-7 shadow-sm">
                      저는 영혜가 끝까지 설명되지 않는 인물이라는 점이 오히려 중요하다고 느꼈어요. 독자가 영혜를 완전히 이해하지 못하게 하면서도, 왜 그 자리에 몰렸는지는 분명히 보이더라고요.
                      <div className="mt-1 text-right body_2_2 text-Gray-4">15:50</div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[85%] break-words rounded-2xl bg-[#f0ece8] px-3 py-2.5 body_2_2 text-Gray-7 shadow-sm">
                      특히 주변 인물들이 영혜를 바라보는 방식이 인상적이었어요. 누구도 영혜 자체를 보지 않고, 각자 자기 입장에서 해석하고 소비하려는 느낌이라서 더 선명하게 읽혔어요.
                      <div className="mt-1 text-right body_2_2 text-Gray-4">15:50</div>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[85%] break-words rounded-2xl bg-[#fce8e6] px-3 py-2.5 body_2_2 text-Gray-7 shadow-sm">
                      맞아요. 그래서 저는 이 소설이 영혜를 설명하는 이야기라기보다, 한 사람을 끝내 이해하지 못하는 사회와 관계를 보여주는 이야기처럼 느껴졌어요.
                      <div className="mt-1 text-right body_2_2 text-Gray-4">15:50</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex w-full items-center rounded-full border border-[#C4A068] bg-white px-5 py-3 shadow-sm">
                <span className="body_1_1 flex-1 text-Gray-7">독서 토론의 처음부터 끝까지, 책모!</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <path d="M22 2L11 13" stroke="#C4A068" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#C4A068" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* 로고 + 가입하기 버튼 */}
        <FadeInSection delay={0.1} className="mt-16 flex flex-col items-center gap-6 pb-16 t:mt-20 t:pb-24">
          <div className="relative h-12 w-20 t:h-14 t:w-24">
            <Image
              src="/logo.svg"
              alt="책모"
              fill
              className="object-contain brightness-0 invert"
            />
          </div>
          <button
            onClick={handleJoin}
            className="subhead_3_2 cursor-pointer rounded-full bg-primary-1 px-8 py-3.5 text-white transition hover:bg-primary-3 hover:shadow-lg active:scale-95"
          >
            지금 가입하기
          </button>
        </FadeInSection>
      </div>
    </section>
  );
}
