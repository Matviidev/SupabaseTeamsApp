import { Hono } from "@hono/hono";
import { zValidator } from "@hono/zod-validator";
import { formatZodError } from "../utils/formatZodError.ts";
import { authMiddleware } from "../common/middleware/auth.ts";
import { AuthCtx } from "../common/middleware/types.ts";
import { CreateTeamSchema } from "./schemas/createTeam.schema.ts";
import * as TeamsService from "./teams.service.ts";
import { JoinTeamSchema } from "./schemas/joinTeam.schema.ts";
import { IdParamSchema } from "../common/schemas/queryId.schema.ts";

const teams = new Hono<AuthCtx>();

teams.use("*", authMiddleware);

teams.get(
  "/:id",
  zValidator("param", IdParamSchema, formatZodError),
  async (c) => {
    const { id: teamId } = c.req.valid("param");
    const authUser = c.get("user");
    const user = await TeamsService.getTeamById(authUser, teamId);
    return c.json(user);
  },
);

teams.post(
  "/",
  zValidator("json", CreateTeamSchema, formatZodError),
  async (c) => {
    const body = c.req.valid("json");
    const authUser = c.get("user");
    const user = await TeamsService.createTeam(authUser, body);
    return c.json(user);
  },
);

teams.post(
  "/join",
  zValidator("json", JoinTeamSchema, formatZodError),
  async (c) => {
    const { code } = c.req.valid("json");
    const authUser = c.get("user");
    const user = await TeamsService.joinTeam(authUser, code);
    return c.json(user);
  },
);

teams.patch("/leave", async (c) => {
  const authUser = c.get("user");
  const user = await TeamsService.leaveTeam(authUser);
  return c.json(user);
});

export default teams;
