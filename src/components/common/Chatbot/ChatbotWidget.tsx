"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import FloatingFab from "@/components/base-ui/Float";
import { useChatbotMessageMutation } from "@/hooks/mutations/useChatbotMutation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollLock } from "@/hooks/useScrollLock";
import { hasErrorCode } from "@/lib/api/errors";
import { useAuthStore } from "@/store/useAuthStore";
import { useSearchStore } from "@/store/useSearchStore";

const WELCOME_MESSAGE =
  "안녕하세요! 책모 이용을 도와드릴게요. 사용 중 궁금한 점을 자유롭게 물어보세요.";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type FailedRequest = {
  message: string;
  description: string;
  kind: "retry" | "expired";
};

type ChatbotWidgetProps = {
  isAppOpenCtaVisible: boolean;
};

function createInitialMessages(): ChatMessage[] {
  return [
    {
      id: "chatbot-welcome",
      role: "assistant",
      text: WELCOME_MESSAGE,
    },
  ];
}

function isChatbotExcludedPath(pathname: string) {
  return (
    pathname === "/ui-test" ||
    pathname.startsWith("/admin") ||
    /^\/groups\/[^/]+\/admin(?:\/|$)/.test(pathname)
  );
}

function hasBottomRightCollision(pathname: string, isLoggedIn: boolean) {
  if (!isLoggedIn && (pathname === "/" || pathname === "/home")) {
    return true;
  }

  return (
    pathname === "/stories" ||
    /^\/news(?:\/[^/]+)?$/.test(pathname) ||
    pathname === "/profile/mypage" ||
    /^\/groups\/[^/]+\/notice$/.test(pathname) ||
    /^\/groups\/[^/]+\/bookcase$/.test(pathname) ||
    /^\/groups\/[^/]+\/bookcase\/[^/]+\/meeting$/.test(pathname)
  );
}

function getFailedRequest(error: unknown, message: string): FailedRequest {
  if (hasErrorCode(error) && error.code === "CHATBOT_404") {
    return {
      message,
      kind: "expired",
      description:
        "대화 세션이 만료되었어요. 새 대화를 시작한 뒤 다시 질문해 주세요.",
    };
  }

  if (
    hasErrorCode(error) &&
    (error.code === "CHATBOT_502" || error.code === "CHATBOT_503")
  ) {
    return {
      message,
      kind: "retry",
      description:
        "챗봇이 잠시 응답하지 못하고 있어요. 잠시 후 다시 시도해 주세요.",
    };
  }

  if (error instanceof Error && error.message === "Request timeout") {
    return {
      message,
      kind: "retry",
      description:
        "답변을 기다리는 시간이 길어졌어요. 잠시 후 다시 시도해 주세요.",
    };
  }

  return {
    message,
    kind: "retry",
    description: "답변을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
  };
}

export default function ChatbotWidget({
  isAppOpenCtaVisible,
}: ChatbotWidgetProps) {
  const pathname = usePathname();
  const isTabletUp = useMediaQuery("(min-width: 768px)");
  const isSearchOpen = useSearchStore((state) => state.isSearchOpen);
  const { isLoggedIn, isLoginModalOpen } = useAuthStore();
  const chatbotMutation = useChatbotMessageMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(createInitialMessages);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [failedRequest, setFailedRequest] = useState<FailedRequest | null>(null);

  const messageIdRef = useRef(0);
  const requestInFlightRef = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isExcluded = isChatbotExcludedPath(pathname);
  const isSuppressed = isSearchOpen || isLoginModalOpen;
  const isPanelVisible = isOpen && !isExcluded && !isSuppressed;
  const shouldShowTrigger = !isOpen && !isExcluded && !isSuppressed;
  const hasCollision = hasBottomRightCollision(pathname, isLoggedIn);

  useScrollLock(isPanelVisible && !isTabletUp);

  useEffect(() => {
    if (!isPanelVisible) return;

    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [isPanelVisible]);

  useEffect(() => {
    if (!isPanelVisible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setIsOpen(false);
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPanelVisible]);

  useEffect(() => {
    if (!isPanelVisible) return;

    const frame = window.requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [failedRequest, isPanelVisible, messages, chatbotMutation.isPending]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
  }, [draft]);

  const nextMessageId = (role: ChatMessage["role"]) => {
    messageIdRef.current += 1;
    return `chatbot-${role}-${messageIdRef.current}`;
  };

  const handleClose = () => {
    setIsOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const handleNewConversation = () => {
    chatbotMutation.reset();
    setSessionToken(null);
    setMessages(createInitialMessages());
    setFailedRequest(null);
    setDraft("");
    window.requestAnimationFrame(() => inputRef.current?.focus());
  };

  const sendMessage = async (message: string, appendUserMessage: boolean) => {
    if (requestInFlightRef.current) return;

    requestInFlightRef.current = true;
    setFailedRequest(null);

    if (appendUserMessage) {
      setMessages((current) => [
        ...current,
        { id: nextMessageId("user"), role: "user", text: message },
      ]);
    }

    try {
      const reply = await chatbotMutation.mutateAsync({
        ...(sessionToken ? { sessionToken } : {}),
        message,
      });

      setSessionToken(reply.sessionToken);
      setMessages((current) => [
        ...current,
        {
          id: nextMessageId("assistant"),
          role: "assistant",
          text: reply.replyText,
        },
      ]);
    } catch (error) {
      if (hasErrorCode(error) && error.code === "CHATBOT_404") {
        setSessionToken(null);
      }
      setFailedRequest(getFailedRequest(error, message));
    } finally {
      requestInFlightRef.current = false;
    }
  };

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const message = draft.trim();
    if (!message || requestInFlightRef.current) return;

    setDraft("");
    void sendMessage(message, true);
  };

  const handleRetry = () => {
    if (!failedRequest || failedRequest.kind !== "retry") return;
    void sendMessage(failedRequest.message, false);
  };

  const handleInputKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }

    event.preventDefault();
    handleSubmit();
  };

  const floatingPositionClass = isAppOpenCtaVisible
    ? hasCollision
      ? "!bottom-[calc(env(safe-area-inset-bottom)_+_158px)] t:!bottom-[138px]"
      : "!bottom-[calc(env(safe-area-inset-bottom)_+_158px)] t:!bottom-[54px]"
    : hasCollision
      ? "!bottom-[142px] t:!bottom-[138px]"
      : "";

  return (
    <>
      {shouldShowTrigger && (
        <FloatingFab
          buttonRef={triggerRef}
          iconSrc="/icons_chat.svg"
          iconAlt="책모 챗봇 열기"
          onClick={() => setIsOpen(true)}
          className={floatingPositionClass}
        />
      )}

      {isPanelVisible && (
        <div className="fixed inset-0 z-[80] bg-Black/10 t:pointer-events-none t:bg-transparent">
          <section
            id="checkmo-chatbot-panel"
            role="dialog"
            aria-label="책모 도우미"
            aria-modal={!isTabletUp}
            className="pointer-events-auto fixed inset-0 flex h-[100dvh] flex-col overflow-hidden bg-background shadow-[0_3px_12px_rgba(61,52,46,0.2)] t:inset-auto t:right-[43px] t:bottom-[54px] t:h-[640px] t:max-h-[calc(100dvh-108px)] t:w-[426px] t:rounded-[8px] t:border t:border-Subbrown-4"
          >
            <header className="grid min-h-16 grid-cols-[72px_1fr_72px] items-center border-b border-Subbrown-4 bg-White px-4">
              <button
                type="button"
                onClick={handleNewConversation}
                disabled={chatbotMutation.isPending}
                className="justify-self-start text-primary-3 body_2_1 transition-colors hover:text-primary-1 disabled:text-Gray-3"
              >
                새 대화
              </button>

              <h2 className="text-center text-Gray-7 subhead_4_1">
                책모 도우미
              </h2>

              <button
                type="button"
                onClick={handleClose}
                aria-label="챗봇 닫기"
                className="flex h-10 w-10 items-center justify-center justify-self-end rounded-full text-primary-3 transition-colors hover:bg-Subbrown-4"
              >
                <svg
                  aria-hidden="true"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 6L18 18M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </header>

            <div
              className="flex-1 overflow-y-auto px-4 py-5 t:px-5"
              aria-live="polite"
              aria-busy={chatbotMutation.isPending}
            >
              <div className="flex flex-col gap-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.role === "user"
                        ? "flex justify-end"
                        : "flex justify-start"
                    }
                  >
                    <p
                      className={[
                        "max-w-[85%] whitespace-pre-wrap break-words rounded-[12px] px-4 py-3 body_1_3",
                        message.role === "user"
                          ? "rounded-br-[4px] bg-primary-1 text-White"
                          : "rounded-bl-[4px] border border-Subbrown-4 bg-White text-Gray-7",
                      ].join(" ")}
                    >
                      {message.text}
                    </p>
                  </div>
                ))}

                {chatbotMutation.isPending && (
                  <div className="flex justify-start" role="status">
                    <div className="flex h-11 items-center gap-1 rounded-[12px] rounded-bl-[4px] border border-Subbrown-4 bg-White px-4">
                      {[0, 1, 2].map((index) => (
                        <span
                          key={index}
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-Subbrown-1"
                          style={{ animationDelay: `${index * 120}ms` }}
                        />
                      ))}
                      <span className="sr-only">답변을 작성하고 있어요.</span>
                    </div>
                  </div>
                )}

                {failedRequest && !chatbotMutation.isPending && (
                  <div
                    role="alert"
                    className="rounded-[8px] border border-Subbrown-3 bg-White p-4"
                  >
                    <p className="text-Gray-6 body_1_3">
                      {failedRequest.description}
                    </p>
                    <button
                      type="button"
                      onClick={
                        failedRequest.kind === "expired"
                          ? handleNewConversation
                          : handleRetry
                      }
                      className="mt-3 rounded-[8px] bg-primary-2 px-4 py-2 text-White body_2_1 transition-colors hover:bg-primary-1"
                    >
                      {failedRequest.kind === "expired"
                        ? "새 대화 시작"
                        : "다시 시도"}
                    </button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-Subbrown-4 bg-White px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)_+_12px)] t:px-5 t:py-4"
            >
              <div className="flex items-end gap-2 rounded-[12px] border border-Subbrown-3 bg-background p-2 focus-within:border-primary-2">
                <textarea
                  ref={inputRef}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  disabled={chatbotMutation.isPending}
                  rows={1}
                  aria-label="챗봇 질문 입력"
                  placeholder="궁금한 내용을 입력해 주세요"
                  className="max-h-[120px] min-h-11 flex-1 resize-none overflow-y-auto bg-transparent px-2 py-3 text-Gray-7 outline-none body_1_3 placeholder:text-Gray-3 disabled:text-Gray-4"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || chatbotMutation.isPending}
                  aria-label="질문 보내기"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-primary-2 text-White transition-colors hover:bg-primary-1 disabled:bg-Gray-2"
                >
                  <svg
                    aria-hidden="true"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 19V5M6.5 10.5L12 5L17.5 10.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <p className="mt-2 text-center text-Gray-4 body_2_3">
                개인정보를 입력하지 마세요.
              </p>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
