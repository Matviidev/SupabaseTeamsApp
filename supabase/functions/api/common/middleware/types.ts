import { Kysely } from "kysely";
import { DB } from "../../db/types.ts";

export type SupabaseJwtPayload = {
  iss?: string;
  sub: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  email: string;
  app_metadata: {
    provider?: string;
    [key: string]: any;
  };
  user_metadata: {
    [key: string]: any;
  };
  role?: string;
};

export type UserData = {
  db: Kysely<DB>;
  payload: SupabaseJwtPayload;
};

export type HonoEnv = {
  Variables: {
    user: UserData;
  };
};
