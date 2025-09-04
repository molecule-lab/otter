import { createWriteStream } from "fs"
import fs from "fs/promises"
import { join } from "path"
import { FastifyReply, FastifyRequest } from "fastify"

const createDocuments = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const file = await request.file()

    const uploadDir = join(process.cwd(), "..", "..", "__uploads__")
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

    const absolutePath = join(
      process.cwd(),
      "..",
      "..",
      "__uploads__",
      file.filename,
    )

    return reply.code(200).send({
      message: "Document Added for processing",
      data: {
        absolutePath,
        filepath: `__uploads__/${file?.filename}`,
      },
    })
  } catch (error) {
    request.server.log.error(`"Document Upload Error:", ${error}`)
    reply.status(500).send({
      error: "Document Upload  error",
      code: "Document Upload Failed",
    })
  }
}

const getDocuments = async (_: FastifyRequest, reply: FastifyReply) => {
  return reply.code(200).send({ message: "Fetch Documents" })
}

export { getDocuments, createDocuments }
