import { NodePgDatabase } from "drizzle-orm/node-postgres"

import { account, apikey, session, user, verification } from "./schema"

export type DatabaseSchema = {
  user: typeof user
  account: typeof account
  apikey: typeof apikey
  session: typeof session
  verification: typeof verification
}

export type DatabaseInstance = NodePgDatabase<DatabaseSchema>
