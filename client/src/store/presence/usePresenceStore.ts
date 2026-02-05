// store/usePresenceStore.ts
import { create } from "zustand";
import { supabase } from "@/lib/supabase";

interface PresenceMember {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  email: string;
}

interface PresenceState {
  onlineMembers: PresenceMember[];
  joinTeamPresence: (teamId: string, user: any) => void;
  leaveTeamPresence: () => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
  onlineMembers: [],
  joinTeamPresence: (teamId, user) => {
    const channel = supabase.channel(`team:${teamId}`, {
      config: { presence: { key: user.id } },
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const members = Object.values(state)
        .flat()
        .map((m: any) => ({
          id: m.id,
          first_name: m.first_name,
          last_name: m.last_name,
          role: m.role,
          email: m.email,
        }));
      set({ onlineMembers: members });
    });

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channel.track({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          email: user.email,
        });
      }
    });

    // Save unsubscribe function to leave later
    (window as any)._teamChannel = channel;
  },
  leaveTeamPresence: () => {
    const channel = (window as any)._teamChannel;
    if (channel) channel.unsubscribe();
    set({ onlineMembers: [] });
  },
}));
