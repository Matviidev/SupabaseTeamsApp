import { decode } from "https://deno.land/x/djwt/mod.ts";
import { MiddlewareHandler } from "@hono/hono";
import { getDb } from "../../db/database.ts";
import { HonoEnv, SupabaseJwtPayload } from "./types.ts";

export const authMiddleware: MiddlewareHandler<HonoEnv> = async (c, next) => {
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
