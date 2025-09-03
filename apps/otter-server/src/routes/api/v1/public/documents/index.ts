import { createWriteStream } from "fs"
import fs from "fs/promises"
import { join } from "path"
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox"

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.addHook("preHandler", async (request, reply) => {
    const session = await fastify?.auth?.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return reply.unauthorized()
    }
  })

  fastify.post("/", {}, async (request, reply) => {
    try {
      const file = await request.file()

      const uploadDir = join(process.cwd(), "__uploads__")
      await fs.mkdir(uploadDir, { recursive: true })

      if (!file?.filename) {
        return
      }

      const filePath = join(uploadDir, file.filename)

      await new Promise((resolve, reject) => {
        const ws = createWriteStream(filePath)
        file?.file.pipe(ws)
        ws.on("finish", resolve)
        ws.on("error", reject)
      })

      return reply.code(200).send({
        message: "Document Added for processing",
        data: {
          filepath: `__uploads__/${file?.filename}`,
        },
      })
    } catch (error) {
      fastify.log.error(`"Document Upload Error:", ${error}`)
      reply.status(500).send({
        error: "Document Upload  error",
        code: "Document Upload Failed",
      })
    }
  })

  fastify.get("/", {}, async (request, reply) => {
    return reply.code(200).send({ message: "Fetch Documents" })
  })
}

export default plugin
