/**
 * Knowledge controllers for document processing.
 *
 * Responsibilities:
 * - `createKnowledge`: Handle file uploads, create source records, and process through complete RAG pipeline.
 * - `fetchKnowledge`: Placeholder for document retrieval functionality.
 * - Coordinate between source service, knowledge job service, and knowledge item service for complete processing.
 * - Handle file validation (PDF only) and error responses for document processing workflow.
 * - Process documents synchronously through parse, chunk, embed, and store operations.
 */

import { KnowledgeItemService } from "@/services/knowledge-item"
import { knowledgeJobService } from "@/services/knowledge-job"
import { sourceService } from "@/services/source"
import { FastifyReply, FastifyRequest } from "fastify"

/**
 * Handles file upload and processes through complete RAG pipeline synchronously.
 * Validates PDF files, creates source record, processes through parse/chunk/embed stages,
 * and stores the final knowledge item with chunks and embeddings.
 * @param request - Fastify request object containing multipart file data
 * @param reply - Fastify reply object for sending response
 * @returns Promise that resolves to success response with knowledge item data or error response
 */
const createKnowledge = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const file = await request.file()

  if (!file) {
    return reply.badRequest()
  }

  if (file?.mimetype !== "application/pdf") {
    return reply.badRequest("Only PDF files are allowed")
  }

  // Create source record and store file on disk
  const source = await sourceService(
    request.server.repositories.source,
  ).createSource(file, request.apiKeyId!)

  // Create knowledge job and process through complete RAG pipeline
  const knowledgeJobServiceInstance = knowledgeJobService(
    request.server.repositories.knowledgeJob,
    request.server.ai,
  )

  // Create knowledge job record in database with source association
  const knowledgeJob = await knowledgeJobServiceInstance.createJob(source)

  // Process job through parse, chunk, and embed stages
  const processedJob =
    await knowledgeJobServiceInstance.processJob(knowledgeJob)

  // Store final knowledge item with chunks and embeddings in database
  const knowledgeItem = await KnowledgeItemService(
    request.server.db,
  ).storeKnowledge(processedJob)

  // Return knowledge item details to user (processing is complete)
  return reply.code(200).send({
    message: "Document processed and stored successfully",
    data: {
      knowledgeItem,
    },
  })
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
