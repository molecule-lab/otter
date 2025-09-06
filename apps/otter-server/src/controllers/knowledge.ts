/**
 * Knowledge controllers for document processing.
 *
 * Responsibilities:
 * - `createKnowledge`: Handle file uploads, save to disk, and create processing jobs.
 * - `fetchKnowledge`: Placeholder for document retrieval functionality.
 * - Manage file storage in `__uploads__` directory with proper error handling.
 * - Insert job records into `knowledge_jobs` table for background processing.
 */

import { knowledgeJobsService } from "@/src/services/knowledge-jobs"
import { FastifyReply, FastifyRequest } from "fastify"

const createKnowledge = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const file = await request.file()

    if (!file) {
      return reply.badRequest()
    }

    const knowledgeJob = await knowledgeJobsService(
      request.server.knowledgeJobsRepository,
    ).processFile(file, request.apiKeyId!)

    // Return to user
    return reply.code(200).send({
      message: "Document Added for processing",
      data: {
        knowledgeJob,
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

const fetchKnowledge = async (_: FastifyRequest, reply: FastifyReply) => {
  return reply.code(200).send({ message: "Fetch Documents" })
}

export { createKnowledge, fetchKnowledge }
