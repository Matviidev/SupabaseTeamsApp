import { Updateable } from "kysely";
import { Profiles, DBExecutor } from "shared/db/types.ts";

export const findById = (db: DBExecutor, id: string) => {
  return db
    .selectFrom("profiles")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirstOrThrow();
};

export const findAll = (db: DBExecutor) => {
  return db.selectFrom("profiles").selectAll().execute();
};

export const updateById = (
  db: DBExecutor,
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
