import {
  Expression,
  ExpressionBuilder,
  Insertable,
  Kysely,
  SelectQueryBuilder,
  sql,
  Updateable,
} from "kysely";
import { DB, Products } from "../db/types.ts";
import {
  GetProductsQuery,
  PaginationCursor,
} from "./schemas/getProductsParams.schema.ts";
import { jsonObjectFrom } from "kysely/helpers/postgres";

const selectFields = [
  "id",
  "title",
  "description",
  "imageUrl",
  "status",
  "createdBy",
  "createdAt",
  "updatedAt",
] as const;

interface SelectOptions {
  omitUsers?: boolean;
}

function users(
  eb: ExpressionBuilder<DB, "products">,
  creatorId: Expression<string>,
) {
  return jsonObjectFrom(
    eb
      .selectFrom("profiles")
      .select(["id", "fullName", "avatarUrl", "isOnline", "lastSeen"])
      .whereRef("profiles.id", "=", creatorId),
  ).as("user");
}

const applyCursor = <O>(
  qb: SelectQueryBuilder<DB, "products", O>,
  { createdAt, id }: PaginationCursor,
  sortDir: "asc" | "desc",
) => {
  const char = sortDir === "asc" ? ">" : "<";
  return qb.where(sql`(created_at, id)`, char, sql`(${createdAt}, ${id})`);
};

export const findById = (db: Kysely<DB>, id: string, opt?: SelectOptions) => {
  return db
    .selectFrom("products")
    .select(selectFields)
    .where("id", "=", id)
    .$if(!opt?.omitUsers, (qb) =>
      qb.select((eb) => [users(eb, eb.ref("products.createdBy"))]),
    )
    .executeTakeFirstOrThrow();
};

export const create = (
  db: Kysely<DB>,
  data: Insertable<Products>,
  opt?: SelectOptions,
) => {
  return db
    .insertInto("products")
    .values(data)
    .returning(selectFields)
    .$if(!opt?.omitUsers, (qb) =>
      qb.returning((eb) => [users(eb, eb.ref("products.createdBy"))]),
    )
    .executeTakeFirstOrThrow();
};

export const getPaginated = (
  db: Kysely<DB>,
  { cursor, status, q, sortDir, createdBy, limit }: GetProductsQuery,
  opt?: SelectOptions,
) => {
  return db
    .selectFrom("products")
    .select(selectFields)
    .$if(!opt?.omitUsers, (qb) =>
      qb.select((eb) => [users(eb, eb.ref("products.createdBy"))]),
    )
    .$if(!!createdBy, (qb) => qb.where("createdBy", "=", createdBy!))
    .$if(!!status, (qb) => qb.where("status", "=", status!))
    .$if(!!q, (qb) =>
      qb.where("fts", "@@", sql<string>`websearch_to_tsquery('english', ${q})`),
    )
    .$if(!!cursor, (qb) => applyCursor(qb, cursor!, sortDir))
    .limit(limit)
    .orderBy("createdAt", sortDir)
    .orderBy("id", sortDir)
    .execute();
};

export const updateById = (
  db: Kysely<DB>,
  id: string,
  data: Updateable<Products>,
  opt?: SelectOptions,
) => {
  return db
    .updateTable("products")
    .where("id", "=", id)
    .set(data)
    .returning(selectFields)
    .$if(!opt?.omitUsers, (qb) =>
      qb.returning((eb) => [users(eb, eb.ref("products.createdBy"))]),
    )
    .executeTakeFirstOrThrow();
};

export const deleteById = (db: Kysely<DB>, id: string) => {
  console.log(id);
  return db
    .deleteFrom("products")
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
};
