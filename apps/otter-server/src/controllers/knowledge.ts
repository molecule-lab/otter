/**
 * Knowledge controllers for document processing.
 *
 * Responsibilities:
 * - `createKnowledge`: Handle file uploads, create source records, and process through RAG pipeline.
 * - `fetchKnowledge`: Placeholder for document retrieval functionality.
 * - Coordinate between source service and knowledge job service for complete processing.
 * - Handle file validation and error responses for document processing workflow.
 */

import { knowledgeJobService } from "@/services/knowledge-job"
import { sourceService } from "@/services/source"
import { FastifyReply, FastifyRequest } from "fastify"

/**
 * Handles file upload and processes through complete RAG pipeline.
 * @param request - Fastify request object containing multipart file data
 * @param reply - Fastify reply object for sending response
 * @returns Promise that resolves to success response with processing results or error response
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

    if (file?.mimetype !== "application/pdf") {
      return reply.badRequest("Only PDF files are allowed")
    }

    const source = await sourceService(
      request.server.sourceRepository,
    ).createSource(file, request.apiKeyId!)

    // Process file upload and create background job for knowledge extraction
    const knowledgeJob = await knowledgeJobService(
      request.server.knowledgeJobRepository,
      request.server.ai,
    ).processSource(source)

    // Return job details to user for tracking processing status
    return reply.code(200).send({
      message: "Document Added for processing",
      data: {
        ...knowledgeJob,
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
