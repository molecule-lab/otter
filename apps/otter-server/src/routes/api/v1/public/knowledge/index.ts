/**
 * Knowledge routes plugin.
 *
 * Responsibilities:
 * - Register POST and GET endpoints at the mounted path.
 * - Verify API key in a `preHandler`; handle rate limiting and unauthorized cases.
 * - Attach `apiKeyId` to the request for downstream handlers.
 * - Delegate POST to `createKnowledge` and GET to `fetchKnowledge`.
 */

import { createKnowledge, fetchKnowledge } from "@/controllers/knowledge"
import {
  createKnowledgeSchema,
  fetchKnowledgeSchema,
} from "@/openapi/knowledge"
import { FastifyInstance } from "fastify"

/**
 * Knowledge routes plugin that registers document processing and search endpoints.
 * Includes API key verification middleware for all routes.
 * @param fastify - Fastify instance to register the knowledge routes on
 * @returns Promise that resolves when all routes and hooks are registered
 */
const plugin = async (fastify: FastifyInstance) => {
  // Verify API key for all knowledge endpoints to ensure authenticated access
  fastify.addHook("preHandler", async (request, reply) => {
    const apiKey = await fastify.auth.api.verifyApiKey({
      body: {
        key: request.headers["x-api-key"] as string,
      },
    })

    // Handle rate limiting from Better Auth
    if (apiKey.error?.code === "RATE_LIMITED") {
      return reply.tooManyRequests()
    }

    // Reject requests without valid API key
    if (!apiKey.valid) {
      return reply.unauthorized()
    }

    // Attach API key ID to request for downstream handlers
    request.apiKeyId = apiKey.key?.id
  })

  fastify.post(
    "/",
    {
      schema: createKnowledgeSchema,
    },
    createKnowledge,
  )

  fastify.get(
    "/",
    {
      schema: fetchKnowledgeSchema,
    },
    fetchKnowledge,
  )
}

export default plugin

declare module "fastify" {
  interface FastifyRequest {
    apiKeyId?: string // Replace 'any' with your actual API key type
  }
}
