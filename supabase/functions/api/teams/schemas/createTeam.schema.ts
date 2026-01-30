import { z } from "zod";

export const CreateTeamSchema = z.object({
  name: z.string().min(1).max(100),
});

export type CreateTeam = z.infer<typeof CreateTeamSchema>;
