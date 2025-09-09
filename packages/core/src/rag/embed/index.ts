/**
 * Text embedding generation for RAG processing.
 *
 * Responsibilities:
 * - Generate vector embeddings for text chunks
 * - Manage concurrent embedding requests with rate limiting
 * - Coordinate with AI clients for embedding generation
 */

import { AIClient } from "@/ai/types"
import { ChunkedJob, EmbeddedJob } from "@/rag/types"
import pLimit from "p-limit"

const limit = pLimit(parseInt(process.env.MAX_PARALLEL_AI_CALLS || "25"))

/**
 * Generates embeddings for all text chunks using the provided AI client.
 * Uses concurrency limiting to prevent API rate limit issues.
 * @param data - Chunked job containing text chunks to embed
 * @param aiClient - AI client instance for embedding generation
 * @returns Promise resolving to job with generated embeddings
 */
export async function embed(
  data: ChunkedJob,
  aiClient: AIClient,
): Promise<EmbeddedJob> {
  // Process all chunks concurrently with rate limiting
  const embeddedChunks = await Promise.all(
    data.chunks.list.map(async (chunk) =>
      limit(async () => ({
        ...chunk,
        // Generate embedding for the chunk text
        embedding: await aiClient.createEmbedding(chunk.text),
      })),
    ),
  )

  // Return job with embedded chunks, preserving original structure
  return { ...data, chunks: { ...data.chunks, list: embeddedChunks } }
}
