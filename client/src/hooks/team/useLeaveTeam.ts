import { leaveTeam } from "@/services/teamService";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLeaveTeam = () => {
  const queryClient = useQueryClient();
  const removeTeam = useAuthStore((state) => state.removeTeam);

  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationFn: leaveTeam,
    onSuccess: (_) => {
      removeTeam();
      queryClient.invalidateQueries({ queryKey: ["team"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Failed to leave team:", error);
    },
  });

  return { leaveTeam: mutate, isPending, isSuccess, error };
};
