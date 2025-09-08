/**
 * Type definitions for RAG (Retrieval-Augmented Generation) processing pipeline.
 *
 * Responsibilities:
 * - Define data structures for document processing stages
 * - Provide type safety across the RAG pipeline
 * - Enable progressive enhancement of job data through processing stages
 */

import { knowledge_jobs } from "@otter/db/schema"
import { InferInsertModel } from "drizzle-orm"
import OpenAI from "openai"

/**
 * Base knowledge job type derived from database schema.
 * Represents the initial state of a document processing job.
 */
export type KnowledgeJob = InferInsertModel<typeof knowledge_jobs>

/**
 * Knowledge job after document parsing stage.
 * Contains the extracted text content from the original document.
 */
export type ParsedJob = KnowledgeJob & { document: { text: string } }

/**
 * Knowledge job after text chunking stage.
 * Contains the document split into manageable chunks for processing.
 */
export type ChunkedJob = ParsedJob & {
  chunks: { list: Array<string>; count: number }
}

/**
 * Knowledge job after embedding generation stage.
 * Contains vector embeddings for each text chunk.
 */
export type EmbeddedJob = ChunkedJob & {
  embeddings: Array<OpenAI.Embeddings.CreateEmbeddingResponse>
}
