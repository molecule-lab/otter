import { FastifyReply, FastifyRequest } from "fastify"

export const healthCheckHandler = (_: FastifyRequest, reply: FastifyReply) => {
  reply.code(200).send({
    message: "Server Running",
  })
}
