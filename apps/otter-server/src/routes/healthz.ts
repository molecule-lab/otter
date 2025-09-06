/**
 * Health check route plugin.
 *
 * Responsibilities:
 * - Register GET `/` endpoint that returns a `{ message: string }` payload.
 * - Define response schema using TypeBox for runtime validation and types.
 * - Delegate handling to `healthCheckHandler`.
 */

import { healthCheckHandler } from "@/controllers/healthz"
import { Type } from "@fastify/type-provider-typebox"
import { FastifyInstance } from "fastify"

const plugin = async (fastify: FastifyInstance) => {
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
