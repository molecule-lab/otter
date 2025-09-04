import { healthCheckHandler } from "@/src/controllers/healthz"
import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox"

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "/",
    {
      schema: {
        response: {
          200: Type.Object({
            message: Type.String(),
          }),
        },
      },
    },
    healthCheckHandler,
  )
}

export default plugin
