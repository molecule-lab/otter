/**
 * Fastify CORS plugin with configurable origins and dynamic public route handling.
 *
 * Responsibilities:
 * - Configure CORS with origins from environment configuration (comma-separated)
 * - Allow all origins for public routes (/ and routes containing "public")
 * - Set up standard CORS headers and methods for API access
 *
 * @see {@link https://github.com/fastify/fastify-cors}
 */

import cors, { FastifyCorsOptions } from "@fastify/cors"
import { FastifyInstance, FastifyRequest } from "fastify"
import fp from "fastify-plugin"

async function corsConfig(fastify: FastifyInstance) {
  await fastify.register(cors, () => {
    return (
      request: FastifyRequest,
      callback: (error: Error | null, corsOptions: FastifyCorsOptions) => void,
    ) => {
      const corsOptions = {
        origin: fastify.config.ORIGINS.split(","),
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
          "Content-Type",
          "Authorization",
          "X-Requested-With",
          "x-api-key",
        ],
        credentials: true,
        maxAge: 86400,
        preflightContinue: true,
      }

      // Todo: Implement a more robust checking for public routes instead of only using public.
      if (request.raw.url === "/" || request.raw.url?.includes("public")) {
        corsOptions.origin = ["*"]
      }

      // callback expects two parameters: error and options
      callback(null, corsOptions)
    }
  })
}

export default fp(corsConfig, {
  name: "cors-config",
})
