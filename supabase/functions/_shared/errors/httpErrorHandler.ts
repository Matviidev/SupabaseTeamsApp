import { Context } from "@hono/hono";
import { HttpError } from "./http.error.ts";
import { ContentfulStatusCode } from "@hono/hono/utils/http-status";

export const httpErrorHandler = (err: unknown, c: Context) => {
  if (err instanceof HttpError) {
    return c.json(
      {
        success: false,
        error: err.message,
      },
      err.status as ContentfulStatusCode,
    );
  }
  console.error("Internal Server Error:", err);
  return c.json(
    {
      success: false,
      error: "Internal Server Error",
    },
    500,
  );
};
