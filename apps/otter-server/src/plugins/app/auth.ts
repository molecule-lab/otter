import { auth, createAuth } from "@/src/utils/auth"
import { FastifyInstance } from "fastify"
import fp from "fastify-plugin"

declare module "fastify" {
  interface FastifyInstance {
    auth: typeof auth
  }
}

async function authPlugin(fastify: FastifyInstance) {
  const auth = createAuth(fastify.db)

  fastify.decorate("auth", auth)
}

export default fp(authPlugin, { name: "auth", dependencies: ["database"] })
