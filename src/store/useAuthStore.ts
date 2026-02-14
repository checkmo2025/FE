import { create } from "zustand";
import Cookies from "js-cookie";
import { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  login: (user) => set({ user, isLoggedIn: true }),
  logout: () => {
    Cookies.remove("accessToken");
    set({ user: null, isLoggedIn: false });
  },
}));
