import { FastifyReply, FastifyRequest } from "fastify";

export async function authorizationCheck(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const isAuthorized =
    request.headers.authorization === request.server.config.SECRET;

  if (!isAuthorized) {
    return reply.unauthorized();
  }
}
