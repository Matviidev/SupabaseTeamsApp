import { Kysely, Updateable } from "kysely";
import { DB, Profiles } from "../db/types.ts";

export const findById = (db: Kysely<DB>, id: string) => {
  return db
    .selectFrom("profiles")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirstOrThrow();
};

export const findAll = (db: Kysely<DB>) => {
  return db.selectFrom("profiles").selectAll().execute();
};

export const updateById = (
  db: Kysely<DB>,
  id: string,
  data: Updateable<Profiles>,
) => {
  return db
    .updateTable("profiles")
    .set(data)
    .returningAll()
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
};
