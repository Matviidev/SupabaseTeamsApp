import { z } from "zod";
import { ProductStatus } from "../../db/types.ts";
import { decodeBase64 } from "@std/encoding/base64";

const statusEnum: ProductStatus[] = ["Draft", "Active", "Deleted"];
export const ProductStatusEnum = z.enum(statusEnum);

export const PaginationCursorSchema = z.object({
  createdAt: z.coerce.date(),
  id: z.string(),
});

export const GetProductsQuerySchema = z.object({
  cursor: z
    .string()
    .optional()
    .transform((s) =>
      s ? new TextDecoder().decode(decodeBase64(s)) : undefined,
    )
    .transform((s) => (s ? JSON.parse(s) : undefined))
    .pipe(PaginationCursorSchema.optional()),

  limit: z.coerce.number().min(1).max(20).default(20),
  q: z.string().trim().optional(),
  status: ProductStatusEnum.optional(),
  createdBy: z.uuid().optional(),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export type GetProductsQuery = z.infer<typeof GetProductsQuerySchema>;
export type PaginationCursor = z.infer<typeof PaginationCursorSchema>;
