/**
 * Knowledge controllers for document processing.
 *
 * Responsibilities:
 * - `createKnowledge`: Handle file uploads, save to disk, and create processing jobs.
 * - `fetchKnowledge`: Placeholder for document retrieval functionality.
 * - Manage file storage in `__uploads__` directory with proper error handling.
 * - Insert job records into `knowledge_jobs` table for background processing.
 */

import { knowledgeJobsService } from "@/services/knowledge-jobs"
import { FastifyReply, FastifyRequest } from "fastify"

/**
 * Handles file upload for knowledge processing.
 * @param request - Fastify request object containing multipart file data
 * @param reply - Fastify reply object for sending response
 * @returns Promise that resolves to success response with job data or error response
 */
const createKnowledge = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const file = await request.file()

    if (!file) {
      return reply.badRequest()
    }

    // Process file upload and create background job for knowledge extraction
    const knowledgeJob = await knowledgeJobsService(
      request.server.knowledgeJobsRepository,
    ).processFile(file, request.apiKeyId!)

    // Return job details to user for tracking processing status
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

/**
 * Placeholder handler for knowledge retrieval functionality.
 * @param _ - Fastify request object (unused)
 * @param reply - Fastify reply object for sending response
 * @returns Promise that resolves to success response with placeholder message
 */
const fetchKnowledge = async (_: FastifyRequest, reply: FastifyReply) => {
  return reply.code(200).send({ message: "Fetch Documents" })
}

export { createKnowledge, fetchKnowledge }
