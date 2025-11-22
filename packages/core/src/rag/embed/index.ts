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
import { safeParseInt } from "@otter/utils"

// Dynamic import for ES module to avoid bundling issues
let pLimit: (concurrency: number) => <T>(fn: () => Promise<T>) => Promise<T>
const getLimit = async () => {
  if (!pLimit) {
    const module = await import("p-limit")
    pLimit = module.default
  }
  return pLimit(safeParseInt(process.env.MAX_PARALLEL_AI_CALLS, 25))
}

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
  // Get the concurrency limiter function dynamically
  const limit = await getLimit()

  // Process all chunks concurrently with rate limiting to avoid API throttling
  const embeddedChunks = await Promise.all(
    data.chunks.list.map(async (chunk) =>
      limit(async () => ({
        ...chunk,
        // Generate vector embedding for the chunk text using AI client
        embedding: await aiClient.createEmbedding(chunk.text),
      })),
    ),
  )

  // Calculate total token usage across all embeddings for monitoring
  const totalTokens = embeddedChunks.reduce(
    (prev, current) => prev + current.embedding.usage.total_tokens,
    0,
  )

  // Return job with embedded chunks, preserving original structure and adding metadata
  return {
    ...data,
    chunks: {
      ...data.chunks,
      list: embeddedChunks,
      embeddingModel: aiClient.embeddingModel,
      embeddingProvider: aiClient.provider,
      totalTokens,
    },
  }
}
