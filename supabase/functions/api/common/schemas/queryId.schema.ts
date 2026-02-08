import { z } from "zod";

export const IdParamSchema = z.object({ id: z.uuid() });

export type IdParam = z.infer<typeof IdParamSchema>;
