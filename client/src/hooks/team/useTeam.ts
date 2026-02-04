import { getTeam } from "@/services/teamService";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useQuery } from "@tanstack/react-query";

export const useTeam = () => {
  const teamId = useAuthStore((state) => state.profile?.teamId!);

  const {
    data: team,
    isPending,
    error,
  } = useQuery({
    queryKey: ["team", teamId],
    enabled: !!teamId,
    queryFn: () => getTeam(teamId!),
  });

  return { team, isPending, error };
};
