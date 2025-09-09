/**
 * Fastify plugin to provide repository instances to the app layer.
 *
 * Responsibilities:
 * - Create repository instances for knowledge jobs and sources data access operations.
 * - Decorate the Fastify instance with repository instances for use across routes and handlers.
 * - Augment Fastify types to expose repository instances with correct typing.
 * - Declare plugin metadata: name `repositories`.
 */

import { createKnowledgeJobRepository } from "@/repositories/knowledge-job"
import { createSourceRepository } from "@/repositories/source"
import { FastifyInstance } from "fastify"
import fp from "fastify-plugin"

declare module "fastify" {
  export interface FastifyInstance {
    knowledgeJobRepository: ReturnType<typeof createKnowledgeJobRepository>
    sourceRepository: ReturnType<typeof createSourceRepository>
  }
}

function repositories(fastify: FastifyInstance) {
  fastify.decorate(
    "knowledgeJobRepository",
    createKnowledgeJobRepository(fastify.db),
  )
  fastify.decorate("sourceRepository", createSourceRepository(fastify.db))
}

export default fp(repositories, { name: "repositories" })
