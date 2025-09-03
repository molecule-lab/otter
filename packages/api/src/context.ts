import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify"

export function createContext({ req, res }: CreateFastifyContextOptions): {
  req: CreateFastifyContextOptions["req"]
  res: CreateFastifyContextOptions["res"]
} {
  return { req, res }
}

export type Context = Awaited<ReturnType<typeof createContext>>
