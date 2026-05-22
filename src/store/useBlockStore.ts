import { create } from "zustand";
import { memberService } from "@/services/memberService";

interface BlockState {
  blockedNicknames: Set<string>;
  isInitialized: boolean;
  setBlockedNicknames: (nicknames: string[]) => void;
  addBlockedNickname: (nickname: string) => void;
  removeBlockedNickname: (nickname: string) => void;
  isBlocked: (nickname: string) => boolean;
  initializeBlocks: () => Promise<void>;
  resetBlocks: () => void;
}

export const useBlockStore = create<BlockState>((set, get) => ({
  blockedNicknames: new Set<string>(),
  isInitialized: false,
  setBlockedNicknames: (nicknames) => set({ blockedNicknames: new Set(nicknames), isInitialized: true }),
  addBlockedNickname: (nickname) => set((state) => {
    const next = new Set(state.blockedNicknames);
    next.add(nickname);
    return { blockedNicknames: next };
  }),
  removeBlockedNickname: (nickname) => set((state) => {
    const next = new Set(state.blockedNicknames);
    next.delete(nickname);
    return { blockedNicknames: next };
  }),
  isBlocked: (nickname) => get().blockedNicknames.has(nickname),
  initializeBlocks: async () => {
    if (get().isInitialized) return;
    try {
      const allNicknames: string[] = [];
      let hasNext = true;
      let cursorId: number | undefined = undefined;

      while (hasNext) {
        const data = await memberService.getBlockedList(cursorId);
        allNicknames.push(...data.blocks.map((b) => b.nickname));
        hasNext = data.hasNext;
        cursorId = data.nextCursor ?? undefined;
        if (!data.hasNext || !data.nextCursor) {
          break;
        }
      }

      set({ blockedNicknames: new Set(allNicknames), isInitialized: true });
    } catch (error) {
      console.error("Failed to initialize blocked users list:", error);
    }
  },
  resetBlocks: () => set({ blockedNicknames: new Set<string>(), isInitialized: false }),
}));
