/**
 * tRPC router configuration and API procedures.
 *
 * Responsibilities:
 * - Define API routes and procedures using tRPC.
 * - Handle input validation using Zod schemas.
 * - Export typed router and procedures for client consumption.
 * - Provide type-safe API endpoints for the application.
 *
 * Exports:
 * - `appRouter` - Main tRPC router containing all API procedures.
 * - `AppRouter` - TypeScript type for the router.
 */

import { Context } from "@/src/context"
import { initTRPC } from "@trpc/server"
import { z } from "zod"

const t = initTRPC.context<Context>().create()

export const appRouter = t.router({
  hello: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input, ctx }) => ({
      message: `Hello ${input.name}`,
      db: ctx.req.server.db,
    })),

  add: t.procedure
    .input(z.object({ a: z.number(), b: z.number() }))
    .mutation(({ input }) => input.a + input.b),
})

export type AppRouter = typeof appRouter
