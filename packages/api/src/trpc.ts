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

import { Context } from "@/context"
import { initTRPC } from "@trpc/server"
import { z } from "zod"

// Initialize tRPC with our custom context type for type safety
const t = initTRPC.context<Context>().create()

/**
 * Main tRPC router containing all API procedures.
 * Provides type-safe endpoints for client consumption.
 */
export const appRouter = t.router({
  /**
   * Hello world procedure for testing API connectivity.
   * Validates input name and returns greeting with database access.
   */
  hello: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => ({
      message: `Hello ${input.name}`,
    })),

  /**
   * Simple addition procedure for testing mutations.
   * Takes two numbers and returns their sum.
   */
  add: t.procedure
    .input(z.object({ a: z.number(), b: z.number() }))
    .mutation(({ input }) => input.a + input.b),
})

/**
 * TypeScript type for the main router.
 * Used for client-side type inference and validation.
 */
export type AppRouter = typeof appRouter
