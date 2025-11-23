/**
 * RAG processing pipeline orchestration.
 *
 * Responsibilities:
 * - Coordinate the complete RAG processing workflow
 * - Process a single knowledge job through parse, chunk, and embed stages
 * - Handle sequential processing of document jobs
 */

import { AIClient } from "@/ai/types"
import { chunk } from "@/rag/chunk/chunk"
import { embed } from "@/rag/embed/embed"
import { parse } from "@/rag/parse/parse"
import { EmbeddedJob } from "@/rag/types"
import { KnowledgeJobWithSource } from "@otter/db/types"

/**
 * Processes a single knowledge job through the complete RAG pipeline.
 * Executes parsing, chunking, and embedding stages sequentially.
 * @param data - Knowledge job to process
 * @param ai - AI client instance for embedding generation
 * @returns Promise resolving to fully processed embedded job
 */
export async function processKnowledgeJob(
  data: KnowledgeJobWithSource,
  ai: AIClient,
): Promise<EmbeddedJob> {
  // Parse document to extract text content
  const processedJob = await parse(data)

  // Chunk parsed document into manageable segments
  const chunkedJob = await chunk(processedJob)

  // Generate embeddings for all chunks
  const embeddedJob = await embed(chunkedJob, ai)

  return embeddedJob
}
