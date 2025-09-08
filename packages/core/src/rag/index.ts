/**
 * RAG processing pipeline orchestration.
 *
 * Responsibilities:
 * - Coordinate the complete RAG processing workflow
 * - Process multiple knowledge jobs through parse, chunk, and embed stages
 * - Handle batch processing of document jobs
 */

import { AIClient } from "@/ai/types"
import { chunk } from "@/rag/chunk"
import { embed } from "@/rag/embed"
import { parse } from "@/rag/parse"
import { EmbeddedJob, KnowledgeJob } from "@/rag/types"

/**
 * Processes an array of knowledge jobs through the complete RAG pipeline.
 * Executes parsing, chunking, and embedding stages for each job.
 * @param data - Array of knowledge jobs to process
 * @param ai - AI client instance for embedding generation
 * @returns Promise resolving to array of fully processed embedded jobs
 */
export async function processKnowledgeJob(
  data: Array<KnowledgeJob>,
  ai: AIClient,
): Promise<Array<EmbeddedJob>> {
  // Parse all documents to extract text content
  const processedJobs = await Promise.all(
    data.map(async (job) => await parse(job)),
  )

  // Chunk all parsed documents into manageable segments
  const chunkedJobs = await Promise.all(
    processedJobs.map(async (job) => await chunk(job)),
  )

  // Generate embeddings for all chunks
  const embeddedJobs = await Promise.all(
    chunkedJobs.map(async (job) => await embed(job, ai)),
  )

  return embeddedJobs
}
