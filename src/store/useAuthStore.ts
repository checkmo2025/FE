import { create } from "zustand";
import Cookies from "js-cookie";
import { User } from "@/types/auth";
import { useBlockStore } from "@/store/useBlockStore";

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoginModalOpen: boolean;
  isInitialized: boolean;
  login: (user: User) => void;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  setInitialized: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoginModalOpen: false,
  isInitialized: false,
  login: (user) => set({ user, isLoggedIn: true, isLoginModalOpen: false, isInitialized: true }),
  logout: () => {
    Cookies.remove("accessToken");
    useBlockStore.getState().resetBlocks();
    set({ user: null, isLoggedIn: false, isInitialized: true });
  },
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  setInitialized: (value) => set({ isInitialized: value }),
}));
