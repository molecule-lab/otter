// /**
//  * This plugins enables the use of CORS.
//  *
//  * @see {@link https://github.com/fastify/fastify-cors}
//  */

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
        origin: "http://localhost:3001",
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

      //Todo: Allow Set Origins for public URL
      if (request.raw.url === "/" || request.raw.url?.includes("public")) {
        corsOptions.origin = "*"
      }

      // callback expects two parameters: error and options
      callback(null, corsOptions)
    }
  })
}

export default fp(corsConfig, {
  name: "cors-config",
})
