import { Hook } from "@hono/zod-validator";

export const formatZodError: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    return c.json(
      {
        success: false,
        message: "Validation Error",
        errors: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        })),
      },
      400,
    );
  }
};
