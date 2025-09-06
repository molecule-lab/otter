/**
 * Knowledge routes plugin.
 *
 * Responsibilities:
 * - Register POST and GET endpoints at the mounted path.
 * - Verify API key in a `preHandler`; handle rate limiting and unauthorized cases.
 * - Attach `apiKeyId` to the request for downstream handlers.
 * - Delegate POST to `createKnowledge` and GET to `fetchKnowledge`.
 */

import { createKnowledge, fetchKnowledge } from "@/src/controllers/knowledge"
import { FastifyInstance } from "fastify"

const plugin = async (fastify: FastifyInstance) => {
  fastify.addHook("preHandler", async (request, reply) => {
    const apiKey = await fastify.auth.api.verifyApiKey({
      body: {
        key: request.headers["x-api-key"] as string,
      },
    })

    if (apiKey.error?.code === "RATE_LIMITED") {
      return reply.tooManyRequests()
    }

    if (!apiKey.valid) {
      return reply.unauthorized()
    }

    request.apiKeyId = apiKey.key?.id
  })

  fastify.post("/", {}, createKnowledge)

  fastify.get(
    "/",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            q: { type: "string" },
          },
          required: ["q"],
        },
      },
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
