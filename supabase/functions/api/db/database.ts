import * as pg from "pg";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { DB } from "./types.ts";

const pool = new pg.default.Pool({
  host: Deno.env.get("DB_HOSTNAME"),
  user: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASSWORD"),
  port: Number(Deno.env.get("DB_PORT")),
  database: "postgres",
  max: 1,
});

export const getDb = (vars: {
  userId: string;
  userEmail: string;
  jwtPayload: any;
}) => {
  return new Kysely<DB>({
    plugins: [new CamelCasePlugin()],
    dialect: new PostgresDialect({
      pool: {
        connect: async () => {
          const client = await pool.connect();

          try {
            await client.query(
              `SELECT 
                set_config('request.jwt.claims', $1, false),
                set_config('request.jwt.claim.sub', $2, false),
                set_config('request.jwt.claim.email', $3, false),
                set_config('role', 'authenticated', false)`,
              [JSON.stringify(vars.jwtPayload), vars.userId, vars.userEmail],
            );
          } catch (e) {
            client.release();
            throw e;
          }

          return client;
        },
        end: async () => {},
      },
    }),
  });
};
