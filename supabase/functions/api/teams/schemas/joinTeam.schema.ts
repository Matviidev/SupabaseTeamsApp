import { z } from "zod";

export const JoinTeamSchema = z.object({
  code: z.string().min(5).max(20),
});

export type CreateTeam = z.infer<typeof JoinTeamSchema>;
