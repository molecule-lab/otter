/**
 * Database type definitions and schema types.
 *
 * Responsibilities:
 * - Define TypeScript types for database schema structure.
 * - Export database instance types for type safety.
 * - Provide typed database interface for application use.
 * - Enable type-safe database operations across the application.
 *
 * Exports:
 * - `DatabaseSchema` - Type definition for the complete database schema.
 * - `DatabaseInstance` - Typed database instance for Drizzle ORM operations.
 */

import { account, apikey, session, user, verification } from "@/src/schema"
import { NodePgDatabase } from "drizzle-orm/node-postgres"

export type DatabaseSchema = {
  user: typeof user
  account: typeof account
  apikey: typeof apikey
  session: typeof session
  verification: typeof verification
}

export type DatabaseInstance = NodePgDatabase<DatabaseSchema>
