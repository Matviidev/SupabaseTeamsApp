import { create } from "zustand";
import type { User, Session } from "@supabase/supabase-js";

interface Profile {
  fullName: string | null;
  avatarUrl: string | null;
  teamId: string | null;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAuthReady: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setAuthReady: (ready: boolean) => void;
  clearAuth: () => void;
  removeTeam: () => void;

  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isAuthReady: false,
  get isAuthenticated() {
    return !!get().session;
  },

  setSession: (session) => {
    const currentSession = get().session;
    // Only update if session actually changed
    if (currentSession?.access_token !== session?.access_token) {
      set({
        session,
        user: session?.user ?? null,
      });
    }
  },

  setProfile: (profile) => {
    const currentProfile = get().profile;
    // Only update if profile actually changed
    if (JSON.stringify(currentProfile) !== JSON.stringify(profile)) {
      set({ profile });
    }
  },

  setAuthReady: (ready) => {
    const currentReady = get().isAuthReady;
    if (currentReady !== ready) {
      set({ isAuthReady: ready });
    }
  },

  removeTeam: () =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, teamId: null } : null,
    })),

  clearAuth: () =>
    set({
      session: null,
      user: null,
      profile: null,
      isAuthReady: true,
    }),
}));

