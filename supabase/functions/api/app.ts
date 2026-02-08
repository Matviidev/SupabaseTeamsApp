import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { httpErrorHandler } from "shared/errors/httpErrorHandler.ts";
import users from "./users/users.controller.ts";
import teams from "./teams/teams.controller.ts";
import products from "./products/products.controller.ts";

export const app = new Hono().basePath(`/api`);

app.use(
  "*",
  cors({
    origin: (origin) => {
      const allowedOrigin = Deno.env.get("ALLOWED_ORIGIN");
      return origin === allowedOrigin ? origin : null;
    },
    allowHeaders: ["Content-Type", "Authorization", "x-client-info", "apikey"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  }),
);

app.onError(httpErrorHandler);

app.route("/users", users);
app.route("/teams", teams);
app.route("/products", products);
