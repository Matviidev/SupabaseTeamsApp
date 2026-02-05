import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { getProfile } from "@/services/authService";
import { useLoadingStore } from "../loading/useLoadingState";
import { usePresenceStore } from "../presence/usePresenceStore";

function AuthListener() {
  const { setSession, setProfile, clearAuth, setAuthReady } = useAuthStore();
  const { setLoading } = useLoadingStore();
  const { joinTeamPresence, leaveTeamPresence } = usePresenceStore();
  useEffect(() => {
    const handleSession = async (session: any) => {
      if (!session) {
        clearAuth();
        setAuthReady(true);
        return;
      }

      setSession(session);

      setLoading(true);
      try {
        const userData = await getProfile();
        setProfile(userData ?? null);

        if (session.user && userData?.teamId) {
          joinTeamPresence(userData.teamId, {
            id: session.user.id,
            fullName: userData.fullName,
            email: session.user.email,
          });
        } else {
          leaveTeamPresence();
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setProfile(null);
      } finally {
        setLoading(false);
        setAuthReady(true);
      }
    };

    const initAuth = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        await handleSession(session);
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        clearAuth();
        setAuthReady(true);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        await handleSession(session);
      },
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [
    setSession,
    setProfile,
    clearAuth,
    setAuthReady,
    setLoading,
    joinTeamPresence,
    leaveTeamPresence,
  ]);

  return null;
}

export default AuthListener;
