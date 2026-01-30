import { z } from "zod";

export const CreateProductSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().nullable().optional(),
  imageUrl: z.url().nullable().optional(),
  teamId: z.uuid(),
});

export type CreateProduct = z.infer<typeof CreateProductSchema>;
