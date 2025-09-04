import { createDocuments, getDocuments } from "@/src/controllers/knowledge"
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox"

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
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
  })

  fastify.post("/", {}, createDocuments)

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
    getDocuments,
  )
}

export default plugin
