/**
 * Database connection factory for creating Drizzle ORM instances.
 *
 * Responsibilities:
 * - Create PostgreSQL connection pool using connection string.
 * - Initialize Drizzle ORM with database schemas.
 * - Provide configured database instance for application use.
 * - Combine all schema modules into a single database interface.
 *
 * Exports:
 * - `createDbConnection(connectionString)` - Factory function that creates a configured
 *   Drizzle database instance with all schemas.
 */

import * as authSchema from "@/src/schema/better-auth"
import * as knowledgeSchema from "@/src/schema/knowledge"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

export function createDbConnection(connectionString: string) {
  const sql = new Pool({
    connectionString: connectionString!,
  })

  return drizzle(sql, {
    schema: {
      ...authSchema,
      ...knowledgeSchema,
    },
  })
}
