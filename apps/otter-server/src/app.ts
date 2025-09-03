import path from "node:path"
import fastifyAutoload from "@fastify/autoload"
import { appRouter, createContext } from "@otter/api"
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify"
import { FastifyInstance, FastifyPluginOptions } from "fastify"
import { Headers, Request } from "node-fetch"

export default async function serviceApp(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
) {
  delete opts.skipOverride

  await fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, "plugins/external"),
    options: { ...opts },
  })

  await fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, "plugins/app"),
    options: { ...opts },
  })

  await fastify.route({
    method: ["GET", "POST", "OPTIONS"],
    url: "/api/auth/*",
    async handler(request, reply) {
      try {
        const url = new URL(request.url, `http://${request.headers.host}`)

        const headers = new Headers()
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) headers.append(key, value.toString())
        })

        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          body: request.body ? JSON.stringify(request.body) : undefined,
        })

        const response = await fastify?.auth?.handler(req)

        reply.status(response.status)
        response.headers.forEach((value: string, key: string) =>
          reply.header(key, value),
        )
        reply.send(response.body ? await response.text() : null)
      } catch (error) {
        fastify.log.error(`"Authentication Error:", ${error}`)
        reply.status(500).send({
          error: "Internal authentication error",
          code: "AUTH_FAILURE",
        })
      }
    },
  })

  await fastify.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: appRouter,
      createContext,
    },
  })

  await fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, "routes"),
    autoHooks: true,
    cascadeHooks: true,
    options: { ...opts },
  })

  fastify.setErrorHandler((err, request, reply) => {
    fastify.log.error(
      {
        err,
        request: {
          method: request.method,
          url: request.url,
          query: request.query,
          params: request.params,
        },
      },
      "Unhandled error occurred",
    )

    reply.code(err.statusCode ?? 500)

    let message = "Internal Server Error"
    if (err.statusCode && err.statusCode < 500) {
      message = err.message
    }

    return { message }
  })

  fastify.setNotFoundHandler(
    {
      preHandler: fastify.rateLimit({
        max: 3,
        timeWindow: 500,
      }),
    },
    (request, reply) => {
      request.log.warn(
        {
          request: {
            method: request.method,
            url: request.url,
            query: request.query,
            params: request.params,
          },
        },
        "Resource not found",
      )

      reply.code(404)

      return { message: "Not Found" }
    },
  )
}
