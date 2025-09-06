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

/**
 * Creates a configured Drizzle database instance with PostgreSQL connection pool.
 * @param connectionString - PostgreSQL connection string (e.g., postgresql://user:pass@host:port/db)
 * @returns Configured Drizzle database instance with all schemas available
 */
export function createDbConnection(connectionString: string) {
  // Create PostgreSQL connection pool for efficient connection management
  const sql = new Pool({
    connectionString: connectionString!,
  })

  // Initialize Drizzle ORM with all schema modules for type-safe database operations
  return drizzle(sql, {
    schema: {
      ...authSchema, // Authentication and user management tables
      ...knowledgeSchema, // Knowledge processing and job tables
    },
  })
}
