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

export function createContext({ req, res }: CreateFastifyContextOptions): {
  req: CreateFastifyContextOptions["req"]
  res: CreateFastifyContextOptions["res"]
} {
  return { req, res }
}

export type Context = Awaited<ReturnType<typeof createContext>>
