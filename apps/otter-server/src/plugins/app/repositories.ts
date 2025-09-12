/**
 * Fastify plugin to provide repository instances to the app layer.
 *
 * Responsibilities:
 * - Create repository instances for knowledge jobs and sources data access operations.
 * - Decorate the Fastify instance with repository instances for use across routes and handlers.
 * - Augment Fastify types to expose repository instances with correct typing.
 * - Declare plugin metadata: name `repositories`.
 */

import { createRepositories } from "@/repositories"
import { FastifyInstance } from "fastify"
import fp from "fastify-plugin"

declare module "fastify" {
  export interface FastifyInstance {
    repositories: ReturnType<typeof createRepositories>
  }
}

function repositories(fastify: FastifyInstance) {
  fastify.decorate("repositories", createRepositories(fastify.db))
}

export default fp(repositories, { name: "repositories" })
