/**
 * Drizzle Kit configuration for database schema management.
 *
 * Responsibilities:
 * - Configure Drizzle Kit for PostgreSQL database migrations and introspection.
 * - Load environment variables from .env file for database credentials.
 * - Define schema file locations for Better Auth and Knowledge processing.
 * - Set output directory for generated migration files.
 *
 * Configuration:
 * - Uses PostgreSQL dialect with connection string from environment.
 * - Includes schema files from @otter/db package for type safety.
 * - Outputs migration files to `./drizzle` directory.
 */

import path from "path"
import * as dotenv from "dotenv"
import { defineConfig } from "drizzle-kit"

// Load environment variables from .env file for database configuration
dotenv.config({ path: path.join(__dirname, ".env") })

/**
 * Drizzle Kit configuration object for database schema management.
 * Defines schema sources, database connection, and migration output settings.
 */
export default defineConfig({
  out: "./drizzle",
  schema: [
    "../../packages/db/src/schema/better-auth.ts",
    "../../packages/db/src/schema/knowledge.ts",
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_CONNECTION_URL!,
  },
})
