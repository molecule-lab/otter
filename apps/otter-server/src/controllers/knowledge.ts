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

import { knowledgeItemService } from "@/services/knowledge-item"
import { knowledgeJobService } from "@/services/knowledge-job"
import { knowledgeQueryService } from "@/services/knowledge-query"
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
  const knowledgeItem = await knowledgeItemService(
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
 * Handles semantic search queries against the knowledge base.
 * Performs vector similarity search to find relevant document chunks and stores query history.
 * @param request - Fastify request object with query string parameter 'q'
 * @param reply - Fastify reply object for sending response
 * @returns Promise that resolves to success response with matching document chunks and similarity scores
 */
const fetchKnowledge = async (
  request: FastifyRequest<{
    Querystring: { q: string }
  }>,
  reply: FastifyReply,
) => {
  // Extract search query from request parameters
  const { q } = request.query

  // Initialize knowledge query service with required dependencies
  const knowledgeQueryServiceInstance = knowledgeQueryService(
    request.server.db,
    request.server.ai,
    request.server.repositories.knowledgeEmbedding,
  )

  // Perform semantic search to find relevant document chunks
  const result = await knowledgeQueryServiceInstance.fetchChunks(q)

  // Store query and results for analytics and history tracking
  await knowledgeQueryServiceInstance.saveKnowledgeQuery(
    q,
    request.apiKeyId!,
    result,
  )

  return reply.code(200).send({ message: "Fetch Documents", result: result })
}

export { createKnowledge, fetchKnowledge }
