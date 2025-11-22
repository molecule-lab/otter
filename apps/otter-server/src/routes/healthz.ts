/**
 * Health check route plugin.
 *
 * Responsibilities:
 * - Register GET `/` endpoint that returns a `{ message: string }` payload.
 * - Define response schema using TypeBox for runtime validation and types.
 * - Delegate handling to `healthCheckHandler`.
 */

import { healthCheckHandler } from "@/controllers/healthz"
import { healthSchema } from "@/openapi/health"
import { FastifyInstance } from "fastify"

/**
 * Health check route plugin that registers the root health endpoint.
 * @param fastify - Fastify instance to register the health check route on
 * @returns Promise that resolves when the route is registered
 */
// eslint-disable-next-line func-style
const plugin = async (fastify: FastifyInstance) => {
  fastify.get(
    "/",
    {
      schema: healthSchema,
    },
    healthCheckHandler,
  )
}

export default plugin
