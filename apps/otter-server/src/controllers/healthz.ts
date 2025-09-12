/**
 * Health check controller.
 *
 * Responsibilities:
 * - Handle health check requests and return a 200 response.
 * - Send a simple `{ message: string }` payload confirming service availability.
 */

import { FastifyReply, FastifyRequest } from "fastify"

/**
 * Health check handler that confirms service availability.
 * @param _ - Fastify request object (unused)
 * @param reply - Fastify reply object for sending response
 * @returns Promise that resolves to 200 response with welcome message
 */
export const healthCheckHandler = async (
  _: FastifyRequest,
  reply: FastifyReply,
) => {
  reply.code(200).send({
    message: "Welcome to Otter",
  })
}
