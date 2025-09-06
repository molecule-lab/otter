/**
 * Fastify plugin to provide the authentication service to the app layer.
 *
 * Responsibilities:
 * - Create an auth instance via `createAuth(fastify.db)` using the database connection.
 * - Decorate the Fastify instance with `auth` for use across routes and handlers.
 * - Augment Fastify types to expose `fastify.auth` with correct typing.
 * - Declare plugin metadata: name `auth`, depends on `database` plugin.
 */

import { auth, createAuth } from "@/src/utils/auth"
import { FastifyInstance } from "fastify"
import fp from "fastify-plugin"

declare module "fastify" {
  interface FastifyInstance {
    auth: typeof auth
  }
}

async function authPlugin(fastify: FastifyInstance) {
  const auth = createAuth(fastify.db)

  fastify.decorate("auth", auth)
}

export default fp(authPlugin, { name: "auth" })
