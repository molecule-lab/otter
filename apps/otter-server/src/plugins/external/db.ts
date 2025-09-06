/**
 * Fastify plugin for database connection and management.
 *
 * Responsibilities:
 * - Create database connection using Drizzle ORM with PostgreSQL.
 * - Decorate the Fastify instance with `db` property for use across routes and handlers.
 * - Test database connection on server startup and handle connection errors.
 * - Provide typed database instance for type-safe database operations.
 * - Augment Fastify types to expose `fastify.db` with correct typing.
 *
 * Dependencies:
 * - Requires `@fastify/env` plugin to be loaded first for configuration access.
 * - Uses `@otter/db` package for database connection factory.
 *
 * Exports:
 * - Default Fastify plugin that registers database connection.
 * - Plugin metadata: name `database`, depends on `@fastify/env`.
 */

import { createDbConnection, type DatabaseInstance } from "@otter/db"
import { sql } from "drizzle-orm"
import { FastifyInstance } from "fastify"
import fp from "fastify-plugin"

declare module "fastify" {
  interface FastifyInstance {
    db: DatabaseInstance
  }
}

// Fastify plugin for database
async function dbPlugin(fastify: FastifyInstance) {
  const db = createDbConnection(fastify.config.DB_CONNECTION_URL)

  // Add database to fastify instance
  fastify.decorate("db", db)

  // Add a hook to test database connection on startup
  fastify.addHook("onReady", async () => {
    try {
      // Test the connection using Drizzle's sql helper
      await db.execute(sql`SELECT 1`)

      fastify.log.info("Database connected successfully")
    } catch (error) {
      fastify.log.error(`Database connection failed: ${error}`)
      throw error
    }
  })
}

// Export the plugin
export default fp(dbPlugin, {
  name: "database",
  dependencies: ["@fastify/env"],
})
