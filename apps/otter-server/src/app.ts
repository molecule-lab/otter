/**
 * Fastify application plugin for the Otter server.
 *
 * Responsibilities:
 * - Auto-register external and app plugins from `plugins/external` and `plugins/app`.
 * - Proxy authentication requests under `/api/v1/auth/*` to the Better Auth handler.
 * - Mount tRPC router at `/trpc` using `@otter/api` (router and context).
 * - Auto-register all route modules from `routes` with hooks cascading enabled.
 * - Define centralized error handling and a 404 handler with rate limiting.
 *
 * Export:
 * - Default async function `serviceApp(fastify, opts)` consumed by `server.ts`.
 */

import path from "node:path"
import fastifyAutoload from "@fastify/autoload"
import { appRouter, createContext } from "@otter/api"
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify"
import { FastifyInstance, FastifyPluginOptions } from "fastify"

/**
 * Main Fastify application plugin that configures the Otter server.
 * Registers plugins, sets up authentication proxy, mounts tRPC, and defines error handling.
 * @param fastify - Fastify instance to configure
 * @param opts - Plugin options passed from server initialization
 * @returns Promise that resolves when all plugins and routes are registered
 */
export default async function serviceApp(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
) {
  // Remove skipOverride to allow plugin overrides during registration
  delete opts.skipOverride

  // Register external plugins first (env, cors, rate limiting, etc.)
  await fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, "plugins/external"),
    options: { ...opts },
  })

  // Register application-specific plugins (database, auth, etc.)
  await fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, "plugins/app"),
    options: { ...opts },
  })

  // Proxy all auth requests to Better Auth handler
  // This allows Better Auth to handle authentication while maintaining Fastify routing
  await fastify.route({
    method: ["GET", "POST", "OPTIONS"],
    url: "/api/v1/auth/*",
    async handler(request, reply) {
      // Reconstruct full URL for Better Auth handler
      const url = new URL(request.url, `http://${request.headers.host}`)

      // Convert Fastify headers to Web API Headers format
      const headers = new Headers()
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value) headers.append(key, value.toString())
      })

      // Create Web API Request object for Better Auth
      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        body: request.body ? JSON.stringify(request.body) : undefined,
      })

      // Forward request to Better Auth handler
      const response = await fastify?.auth?.handler(req)

      // Parse response body safely
      const body = (response.body && JSON.parse(await response.text())) || {}

      // Handle authentication errors by throwing structured error
      if (!response.ok) {
        const error = {
          message: body.message || "Something went wrong",
          status: response.status,
          cause: body.code,
        }
        throw error
      }

      // Forward Better Auth response status and headers to Fastify reply
      reply.status(response.status)
      response.headers.forEach((value: string, key: string) =>
        reply.header(key, value),
      )

      reply.send(body)
    },
  })

  // Mount tRPC router for type-safe API endpoints
  await fastify.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: appRouter,
      createContext,
    },
  })

  // Auto-register all route files with cascading hooks enabled
  await fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, "routes"),
    autoHooks: true, // Enable automatic hook registration
    cascadeHooks: true, // Allow parent hooks to cascade to child routes
    options: { ...opts },
  })

  // Set up 404 handler with aggressive rate limiting to prevent abuse
  fastify.setNotFoundHandler(
    {
      preHandler: fastify.rateLimit({
        max: 3, // Only 3 requests
        timeWindow: 500, // Per 500ms window
      }),
    },
    (request, reply) => {
      // Log 404s with request details for debugging
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
