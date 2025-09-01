import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { createDbConnection } from "@otter/db";
import { sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { users } from "@otter/db";

type DatabaseSchema = {
  users: typeof users;
};
type DatabaseInstance = NodePgDatabase<DatabaseSchema>;

declare module "fastify" {
  interface FastifyInstance {
    db: DatabaseInstance;
  }
}

// Fastify plugin for database
async function dbPlugin(fastify: FastifyInstance) {
  const db = createDbConnection(fastify.config.DB_CONNECTION_URL);

  // Add database to fastify instance
  fastify.decorate("db", db);

  // Add a hook to test database connection on startup
  fastify.addHook("onReady", async () => {
    try {
      // Test the connection using Drizzle's sql helper
      await db.execute(sql`SELECT 1`);

      fastify.log.info("Database connected successfully");
    } catch (error) {
      fastify.log.error(`Database connection failed: ${error}`);
      throw error;
    }
  });
}

// Export the plugin
export default fp(dbPlugin, {
  name: "database",
});
