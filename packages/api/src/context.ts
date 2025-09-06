/**
 * tRPC context creation for request handling.
 *
 * Responsibilities:
 * - Create context object for tRPC procedures.
 * - Provide access to Fastify request and response objects.
 * - Enable dependency injection for procedures.
 * - Define context type for type safety.
 *
 * Exports:
 * - `createContext(options)` - Function that creates tRPC context from Fastify options.
 * - `Context` - TypeScript type for the context object.
 */

import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify"

/**
 * Creates a tRPC context object from Fastify request/response options.
 * @param options - Fastify context options containing request and response objects
 * @param options.req - Fastify request object with server instance and headers
 * @param options.res - Fastify response object for sending replies
 * @returns Context object containing request and response for tRPC procedures
 */
export function createContext({ req, res }: CreateFastifyContextOptions): {
  req: CreateFastifyContextOptions["req"]
  res: CreateFastifyContextOptions["res"]
} {
  return { req, res }
}

/**
 * TypeScript type representing the tRPC context.
 * Derived from the return type of createContext for type safety.
 */
export type Context = Awaited<ReturnType<typeof createContext>>
