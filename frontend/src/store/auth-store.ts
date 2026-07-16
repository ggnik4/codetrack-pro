import { create } from "zustand";
import type { LoginResponse, User } from "@/types/user";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  setSession: (data: LoginResponse) => void;
  setUser: (user: User) => void;
  logout: () => void;
  hydrate: () => void;
}

/**
 * Tokens live in localStorage (read directly by the Axios interceptor in
 * lib/api-client.ts) so a page refresh doesn't lose the session. `hydrate()`
 * is called once on app mount to sync that into the in-memory store.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isHydrated: false,

  setSession: ({ user, access, refresh }) => {
    window.localStorage.setItem("access_token", access);
    window.localStorage.setItem("refresh_token", refresh);
    set({ user, accessToken: access, refreshToken: refresh });
  },

  setUser: (user) => set({ user }),

  logout: () => {
    window.localStorage.removeItem("access_token");
    window.localStorage.removeItem("refresh_token");
    set({ user: null, accessToken: null, refreshToken: null });
  },

  hydrate: () => {
    const access = window.localStorage.getItem("access_token");
    const refresh = window.localStorage.getItem("refresh_token");
    set({ accessToken: access, refreshToken: refresh, isHydrated: true });
  },
}));
