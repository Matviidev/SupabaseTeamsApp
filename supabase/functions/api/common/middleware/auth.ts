import { decode } from "djwt";
import { MiddlewareHandler } from "@hono/hono";
import { getDb } from "shared/db/database.ts";
import { AuthCtx, SupabaseJwtPayload } from "./types.ts";

export const authMiddleware: MiddlewareHandler<AuthCtx> = async (c, next) => {
  const authHeader = c.req.header("Authorization");
  const jwt = authHeader?.replace("Bearer ", "");

  if (!jwt) return c.json({ error: "Unauthorized" }, 401);

  try {
    const [, payload] = decode(jwt) as [unknown, SupabaseJwtPayload, unknown];
    const db = getDb({
      userId: payload.sub,
      userEmail: payload.email,
      jwtPayload: payload,
    });
    c.set("user", { db, payload });

    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
};
