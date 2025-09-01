import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { authorizationCheck } from "../hooks/authorizationCheck";

async function isAuthorized(fastify: FastifyInstance) {
  fastify.decorate("authCheck", authorizationCheck);
}

export default fp(isAuthorized, {
  name: "authPlugin",
});
