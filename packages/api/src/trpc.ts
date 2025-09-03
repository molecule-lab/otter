import { initTRPC } from "@trpc/server"
import { z } from "zod"

const t = initTRPC.create()

export const appRouter = t.router({
  hello: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => ({ message: `Hello ${input.name}` })),

  add: t.procedure
    .input(z.object({ a: z.number(), b: z.number() }))
    .mutation(({ input }) => input.a + input.b),
})

export type AppRouter = typeof appRouter
