import { z } from "zod";
import { ProductStatus } from "shared/db/types.ts";

export const UpdateProductSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  imageUrl: z.url().nullable().optional(),
  status: z.enum(ProductStatus).optional(),
});

export type UpdateProduct = z.infer<typeof UpdateProductSchema>;
