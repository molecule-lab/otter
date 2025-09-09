/**
 * Type definitions for RAG (Retrieval-Augmented Generation) processing pipeline.
 *
 * Responsibilities:
 * - Define data structures for document processing stages
 * - Provide type safety across the RAG pipeline
 * - Enable progressive enhancement of job data through processing stages
 */

import { KnowledgeJobWithSource } from "@otter/db/types"
import OpenAI from "openai"

/**
 * Knowledge job after document parsing stage.
 * Contains the extracted text content from the original document.
 */
export type ParsedJob = KnowledgeJobWithSource & { parsed: { text: string } }

/**
 * Knowledge job after text chunking stage.
 * Contains the document split into manageable chunks for processing.
 */
export type ChunkedJob = ParsedJob & {
  chunks: { list: Array<{ text: string }>; count: number }
}

/**
 * Knowledge job after embedding generation stage.
 * Contains vector embeddings for each text chunk.
 */
export type EmbeddedJob = ChunkedJob & {
  chunks: {
    list: Array<{
      text: string
      embedding: OpenAI.Embeddings.CreateEmbeddingResponse
    }>
    count: number
  }
}
