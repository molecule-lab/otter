import {
  createApiKeySchema,
  createUserSchema,
  getSessionSchema,
  loginUserSchema,
  logoutUserSchema,
} from "@/openapi/auth"
import { createKnowledgeSwaggerSchema } from "@/openapi/knowledge"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import fp from "fastify-plugin"

export default fp(async function (fastify) {
  /**
   * A Fastify plugin for serving Swagger (OpenAPI v2) or OpenAPI v3 schemas
   *
   * @see {@link https://github.com/fastify/fastify-swagger}
   */

  if (fastify.config.NODE_ENV !== "development") {
    return
  }

  await fastify.register(fastifySwagger, {
    hideUntagged: true,
    openapi: {
      info: {
        title: "Otter",
        description: "The official Otter Public and Auth APIs",
        version: "0.1.0",
      },
      paths: {
        "/api/v1/auth/sign-up/email/": {
          post: createUserSchema,
        },
        "/api/v1/auth/sign-in/email/": {
          post: loginUserSchema,
        },
        "/api/v1/auth/sign-out/": {
          post: logoutUserSchema,
        },
        "/api/v1/auth/api-key/create/": {
          post: createApiKeySchema,
        },
        "/api/v1/auth/get-session/": {
          get: getSessionSchema,
        },
        "/api/v1/public/knowledge/": {
          post: createKnowledgeSwaggerSchema,
        },
      },
    },
  })

  /**
   * A Fastify plugin for serving Swagger UI.
   *
   * @see {@link https://github.com/fastify/fastify-swagger-ui}
   */
  await fastify.register(fastifySwaggerUi, {
    routePrefix: "/api/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
  })
})
