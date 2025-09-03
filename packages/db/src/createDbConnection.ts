import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import * as authSchema from "./schema/better-auth"

export function createDbConnection(connectionString: string) {
  const sql = new Pool({
    connectionString: connectionString!,
  })

  return drizzle(sql, {
    schema: {
      ...authSchema,
    },
  })
}
