"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import UnsavedChangesConfirmModal from "@/components/common/UnsavedChangesConfirmModal";

export type UnsavedChangesVariant = "create" | "edit";

export type UnsavedChangesPrompt = {
  title?: string;
  description?: string;
  leaveText?: string;
  stayText?: string;
};

type GuardRegistration = {
  isDirty: boolean;
  priority: number;
  prompt: Required<UnsavedChangesPrompt>;
};

type PendingAction = {
  action: () => void;
  prompt: Required<UnsavedChangesPrompt>;
  restoreHistoryMarker?: boolean;
};

type UnsavedChangesContextValue = {
  hasDirtyChanges: boolean;
  register: (id: string, registration: GuardRegistration) => void;
  unregister: (id: string) => void;
  confirmNavigation: (action: () => void, prompt?: UnsavedChangesPrompt) => boolean;
  runWithoutGuard: (action: () => void) => void;
};

type UseUnsavedChangesGuardOptions = UnsavedChangesPrompt & {
  isDirty: boolean;
  enabled?: boolean;
  variant?: UnsavedChangesVariant;
  priority?: number;
};

const DEFAULT_CREATE_PROMPT: Required<UnsavedChangesPrompt> = {
  title: "작성 중인 내용이 있어요",
  description: "이 화면을 나가면 저장되지 않은 내용이 사라집니다.",
  leaveText: "나가기",
  stayText: "계속 작성",
};

const DEFAULT_EDIT_PROMPT: Required<UnsavedChangesPrompt> = {
  title: "저장되지 않은 변경사항이 있어요",
  description: "이 화면을 나가면 수정한 내용이 사라집니다.",
  leaveText: "나가기",
  stayText: "계속 수정",
};

const HISTORY_MARKER_KEY = "__checkmoUnsavedGuard";

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(null);

function buildPrompt(
  variant: UnsavedChangesVariant,
  prompt?: UnsavedChangesPrompt
): Required<UnsavedChangesPrompt> {
  const base = variant === "edit" ? DEFAULT_EDIT_PROMPT : DEFAULT_CREATE_PROMPT;
  return {
    title: prompt?.title ?? base.title,
    description: prompt?.description ?? base.description,
    leaveText: prompt?.leaveText ?? base.leaveText,
    stayText: prompt?.stayText ?? base.stayText,
  };
}

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function shouldIgnoreAnchor(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");
  if (!href) return true;
  if (href.startsWith("#")) return true;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return true;
  if (anchor.target && anchor.target !== "_self") return true;
  if (anchor.hasAttribute("download")) return true;
  if (anchor.dataset.unsavedGuardIgnore === "true") return true;
  return false;
}

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Record<string, GuardRegistration>>({});
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const hasDirtyChanges = useMemo(
    () => Object.values(registrations).some((item) => item.isDirty),
    [registrations]
  );

  const activePrompt = useMemo(() => {
    const dirtyRegistrations = Object.values(registrations)
      .filter((item) => item.isDirty)
      .sort((a, b) => b.priority - a.priority);

    return dirtyRegistrations[0]?.prompt ?? DEFAULT_CREATE_PROMPT;
  }, [registrations]);

  const hasDirtyChangesRef = useRef(hasDirtyChanges);
  const activePromptRef = useRef(activePrompt);
  const suppressGuardRef = useRef(false);
  const historyMarkerActiveRef = useRef(false);

  useEffect(() => {
    hasDirtyChangesRef.current = hasDirtyChanges;
  }, [hasDirtyChanges]);

  useEffect(() => {
    activePromptRef.current = activePrompt;
  }, [activePrompt]);

  const pushHistoryMarker = useCallback(() => {
    if (typeof window === "undefined") return;
    if (window.history.state?.[HISTORY_MARKER_KEY]) {
      historyMarkerActiveRef.current = true;
      return;
    }

    window.history.pushState(
      {
        ...(window.history.state ?? {}),
        [HISTORY_MARKER_KEY]: true,
      },
      "",
      window.location.href
    );
    historyMarkerActiveRef.current = true;
  }, []);

  useEffect(() => {
    if (hasDirtyChanges) {
      pushHistoryMarker();
      return;
    }

    if (
      historyMarkerActiveRef.current &&
      typeof window !== "undefined" &&
      window.history.state?.[HISTORY_MARKER_KEY]
    ) {
      suppressGuardRef.current = true;
      historyMarkerActiveRef.current = false;
      window.history.back();
      window.setTimeout(() => {
        suppressGuardRef.current = false;
      }, 800);
    }
  }, [hasDirtyChanges, pushHistoryMarker]);

  const runWithoutGuard = useCallback((action: () => void) => {
    suppressGuardRef.current = true;
    action();
    window.setTimeout(() => {
      suppressGuardRef.current = false;
    }, 800);
  }, []);

  const openConfirm = useCallback(
    (action: () => void, prompt?: UnsavedChangesPrompt, restoreHistoryMarker?: boolean) => {
      const resolvedPrompt = prompt
        ? { ...activePromptRef.current, ...prompt }
        : activePromptRef.current;

      setPendingAction({
        action,
        prompt: resolvedPrompt,
        restoreHistoryMarker,
      });
    },
    []
  );

  const confirmNavigation = useCallback(
    (action: () => void, prompt?: UnsavedChangesPrompt) => {
      if (!hasDirtyChangesRef.current || suppressGuardRef.current) {
        action();
        return true;
      }

      openConfirm(action, prompt);
      return false;
    },
    [openConfirm]
  );

  const register = useCallback((id: string, registration: GuardRegistration) => {
    setRegistrations((prev) => {
      const current = prev[id];
      if (
        current &&
        current.isDirty === registration.isDirty &&
        current.priority === registration.priority &&
        current.prompt.title === registration.prompt.title &&
        current.prompt.description === registration.prompt.description &&
        current.prompt.leaveText === registration.prompt.leaveText &&
        current.prompt.stayText === registration.prompt.stayText
      ) {
        return prev;
      }

      return {
        ...prev,
        [id]: registration,
      };
    });
  }, []);

  const unregister = useCallback((id: string) => {
    setRegistrations((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasDirtyChangesRef.current || suppressGuardRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    const handleClickCapture = (event: MouseEvent) => {
      if (!hasDirtyChangesRef.current || suppressGuardRef.current) return;
      if (event.defaultPrevented || event.button !== 0 || isModifiedClick(event)) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (shouldIgnoreAnchor(anchor)) return;

      const url = new URL(anchor.href, window.location.href);
      const currentUrl = new URL(window.location.href);
      const isSameDocument =
        url.origin === currentUrl.origin &&
        url.pathname === currentUrl.pathname &&
        url.search === currentUrl.search &&
        url.hash === currentUrl.hash;

      if (isSameDocument) return;

      event.preventDefault();
      event.stopPropagation();

      openConfirm(() => {
        runWithoutGuard(() => {
          if (url.origin === window.location.origin) {
            router.push(`${url.pathname}${url.search}${url.hash}`);
          } else {
            window.location.assign(url.href);
          }
        });
      });
    };

    document.addEventListener("click", handleClickCapture, true);
    return () => document.removeEventListener("click", handleClickCapture, true);
  }, [openConfirm, router, runWithoutGuard]);

  useEffect(() => {
    const handlePopState = () => {
      if (!hasDirtyChangesRef.current || suppressGuardRef.current) return;
      if (!historyMarkerActiveRef.current) return;

      openConfirm(
        () => {
          runWithoutGuard(() => {
            historyMarkerActiveRef.current = false;
            window.history.back();
          });
        },
        undefined,
        true
      );
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [openConfirm, runWithoutGuard]);

  const handleStay = () => {
    const shouldRestoreHistoryMarker = pendingAction?.restoreHistoryMarker;
    setPendingAction(null);
    if (shouldRestoreHistoryMarker) {
      pushHistoryMarker();
    }
  };

  const handleLeave = () => {
    const action = pendingAction?.action;
    setPendingAction(null);
    if (action) action();
  };

  const contextValue = useMemo(
    () => ({
      hasDirtyChanges,
      register,
      unregister,
      confirmNavigation,
      runWithoutGuard,
    }),
    [hasDirtyChanges, register, unregister, confirmNavigation, runWithoutGuard]
  );

  return (
    <UnsavedChangesContext.Provider value={contextValue}>
      {children}
      <UnsavedChangesConfirmModal
        isOpen={pendingAction !== null}
        title={pendingAction?.prompt.title ?? DEFAULT_CREATE_PROMPT.title}
        description={pendingAction?.prompt.description ?? DEFAULT_CREATE_PROMPT.description}
        leaveText={pendingAction?.prompt.leaveText ?? DEFAULT_CREATE_PROMPT.leaveText}
        stayText={pendingAction?.prompt.stayText ?? DEFAULT_CREATE_PROMPT.stayText}
        onLeave={handleLeave}
        onStay={handleStay}
      />
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChangesNavigation() {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error("useUnsavedChangesNavigation must be used within UnsavedChangesProvider");
  }

  return {
    hasDirtyChanges: context.hasDirtyChanges,
    confirmNavigation: context.confirmNavigation,
    runWithoutGuard: context.runWithoutGuard,
  };
}

export function useUnsavedChangesGuard({
  isDirty,
  enabled = true,
  variant = "create",
  priority = 0,
  title,
  description,
  leaveText,
  stayText,
}: UseUnsavedChangesGuardOptions) {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error("useUnsavedChangesGuard must be used within UnsavedChangesProvider");
  }

  const {
    register,
    unregister,
    hasDirtyChanges,
    confirmNavigation,
    runWithoutGuard,
  } = context;
  const reactId = useId();
  const idRef = useRef(`unsaved-${reactId}`);

  const prompt = useMemo(
    () =>
      buildPrompt(variant, {
        title,
        description,
        leaveText,
        stayText,
      }),
    [variant, title, description, leaveText, stayText]
  );

  useEffect(() => {
    const id = idRef.current;

    register(id, {
      isDirty: enabled && isDirty,
      priority,
      prompt,
    });

    return () => unregister(id);
  }, [register, unregister, enabled, isDirty, priority, prompt]);

  return {
    hasDirtyChanges,
    confirmNavigation,
    runWithoutGuard,
  };
}
