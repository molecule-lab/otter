import { drizzle } from "drizzle-orm/node-postgres";
import * as userSchema from "./schema/users";
import { Pool } from "pg";

export function createDbConnection(connectionString: string) {
  const sql = new Pool({
    connectionString: connectionString!,
  });

  return drizzle(sql, {
    schema: {
      ...userSchema,
    },
  });
}
