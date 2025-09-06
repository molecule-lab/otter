/**
 * Health check controller.
 *
 * Responsibilities:
 * - Handle health check requests and return a 200 response.
 * - Send a simple `{ message: string }` payload confirming service availability.
 */

import { FastifyReply, FastifyRequest } from "fastify"

export const healthCheckHandler = async (
  _: FastifyRequest,
  reply: FastifyReply,
) => {
  reply.code(200).send({
    message: "Welcome to the official fastify demo!",
  })
}
