import { Hono } from "@hono/hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import * as UserService from "./users.service.ts";
import { formatZodError } from "../utils/formatZodError.ts";
import { authMiddleware } from "../common/middleware/auth.ts";
import { UserData } from "../common/middleware/types.ts";

const users = new Hono<{ Variables: { user: UserData } }>();

users.use("*", authMiddleware);

users.get("/me", async (c) => {
  const authUser = c.get("user");
  const user = await UserService.findMe(authUser);
  return c.json(user);
});

users.get(
  "/:id",
  zValidator("param", z.object({ id: z.uuid() }), formatZodError),
  async (c) => {
    const { id } = c.req.valid("param");
    const authUser = c.get("user");
    const user = await UserService.findUserById(authUser, id);
    return c.json(user);
  },
);

users.get("/", async (c) => {
  const authUser = c.get("user");
  const users = await UserService.findAllUsers(authUser);
  return c.json(users);
});

export default users;
