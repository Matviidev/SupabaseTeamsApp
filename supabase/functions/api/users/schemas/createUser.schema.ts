import { z } from "zod";

export const CreateUserSchema = z.object({
  firstName: z.string().max(50),
  lastName: z.string().max(50),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;
