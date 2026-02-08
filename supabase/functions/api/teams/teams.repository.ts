import { Expression, ExpressionBuilder, Insertable, Kysely } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB, Teams, DBExecutor } from "shared/db/types.ts";

interface SelectOptions {
  omitUsers?: boolean;
}

function users(eb: ExpressionBuilder<DB, "teams">, teamId: Expression<string>) {
  return jsonArrayFrom(
    eb
      .selectFrom("profiles")
      .select(["id", "fullName", "avatarUrl", "isOnline", "lastSeen"])
      .whereRef("profiles.teamId", "=", teamId),
  ).as("users");
}

export const create = (db: DBExecutor, data: Insertable<Teams>) => {
  return db
    .insertInto("teams")
    .values(data)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const findByInviteCode = (db: DBExecutor, code: string) => {
  return db
    .selectFrom("teams")
    .where("inviteCode", "=", code)
    .selectAll()
    .executeTakeFirst();
};

export const findById = (db: DBExecutor, id: string, opt?: SelectOptions) => {
  return db
    .selectFrom("teams")
    .where("id", "=", id)
    .selectAll()
    .$if(!opt?.omitUsers, (qb) =>
      qb.select((eb) => [users(eb, eb.ref("teams.id"))]),
    )
    .executeTakeFirst();
};

export const findTeamUsers = (db: DBExecutor, id: string) => {
  return db
    .selectFrom("profiles")
    .where("teamId", "=", id)
    .selectAll()
    .execute();
};
