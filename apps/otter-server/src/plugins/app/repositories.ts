/**
 * Fastify plugin to provide repository instances to the app layer.
 *
 * Responsibilities:
 * - Create repository instances for data access operations.
 * - Decorate the Fastify instance with repository instances for use across routes and handlers.
 * - Augment Fastify types to expose repository instances with correct typing.
 * - Declare plugin metadata: name `repositories`.
 */

import { createKnowledgeJobsRepository } from "@/repositories/knowledge-jobs"
import { FastifyInstance } from "fastify"
import fp from "fastify-plugin"

declare module "fastify" {
  export interface FastifyInstance {
    knowledgeJobsRepository: ReturnType<typeof createKnowledgeJobsRepository>
  }
}

function repositories(fastify: FastifyInstance) {
  fastify.decorate(
    "knowledgeJobsRepository",
    createKnowledgeJobsRepository(fastify),
  )
}

export default fp(repositories, { name: "repositories" })
