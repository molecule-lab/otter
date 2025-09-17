/**
 * Fastify plugin to provide the authentication service to the app layer.
 *
 * Responsibilities:
 * - Create an auth instance via `createAuth(fastify.db, options)` using database connection and config.
 * - Pass configuration options (origins, baseUrl, secret) from environment to auth instance.
 * - Decorate the Fastify instance with `auth` for use across routes and handlers.
 * - Augment Fastify types to expose `fastify.auth` with correct typing.
 * - Declare plugin metadata: name `auth`, depends on `database` plugin.
 */

import { auth, createAuth } from "@/utils/auth"
import { FastifyInstance } from "fastify"
import fp from "fastify-plugin"

declare module "fastify" {
  interface FastifyInstance {
    auth: typeof auth
  }
}

async function authPlugin(fastify: FastifyInstance) {
  const auth = createAuth(fastify.db, {
    origins: fastify.config.ORIGINS,
    baseUrl: fastify.config.BASE_URL,
    secret: fastify.config.AUTH_SECRET,
  })

  fastify.decorate("auth", auth)
}

export default fp(authPlugin, { name: "auth" })
