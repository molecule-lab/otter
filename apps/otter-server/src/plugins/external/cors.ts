/**
 * This plugins enables the use of CORS.
 *
 * @see {@link https://github.com/fastify/fastify-cors}
 */

import cors, { FastifyCorsOptions } from "@fastify/cors"

export const autoConfig: FastifyCorsOptions = {
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
}

export default cors
