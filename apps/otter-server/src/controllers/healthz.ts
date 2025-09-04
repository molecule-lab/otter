import { FastifyReply, FastifyRequest } from "fastify"

export const healthCheckHandler = async (
  _: FastifyRequest,
  reply: FastifyReply,
) => {
  reply.code(200).send({
    message: "Welcome to the official fastify demo!",
  })
}
