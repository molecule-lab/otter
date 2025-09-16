/**
 * Knowledge query service for semantic search operations.
 *
 * Responsibilities:
 * - Execute vector similarity searches against knowledge embeddings
 * - Convert text queries to embeddings for semantic matching
 * - Store query history and results for analytics and tracking
 * - Coordinate between embedding, query, and result repositories
 */

import { createKnowledgeEmbeddingRepository } from "@/repositories/knowledge-embedding"
import { createKnowledgeQueryRepository } from "@/repositories/knowledge-query"
import { createKnowledgeQueryResultRepository } from "@/repositories/knowledge-query-result"
import { AIClient } from "@otter/core"
import { DatabaseInstance } from "@otter/db/types"
import { sql } from "drizzle-orm"

/**
 * Type definition for semantic search results.
 * Contains chunk information and similarity scores for matching content.
 */
type Result = Array<{
  knowledgeChunkId: string
  score: number
  knowledgeChunk: { id: string; text: string }
}>

/**
 * Creates a knowledge query service instance with semantic search capabilities.
 * @param db - Database instance for query operations
 * @param aiClient - AI client for generating embeddings
 * @param knowledgeEmbeddingRepository - Repository for embedding operations
 * @returns Service object with semantic search and query tracking methods
 */
function knowledgeQueryService(
  db: DatabaseInstance,
  aiClient: AIClient,
  knowledgeEmbeddingRepository: ReturnType<
    typeof createKnowledgeEmbeddingRepository
  >,
) {
  return {
    /**
     * Performs semantic search to find relevant knowledge chunks.
     * Converts query text to embedding and searches for similar vectors.
     * @param query - Text query to search for
     * @param limit - Maximum number of results to return (default: 5)
     * @returns Promise resolving to array of matching chunks with similarity scores
     */
    async fetchChunks(query: string, limit: number = 5) {
      const embedding = await aiClient.createEmbedding(query)

      const vectorExpression = sql.raw(
        `ARRAY[${embedding.data[0].embedding.join(",")}]::vector`,
      )

      return knowledgeEmbeddingRepository.findNearest(vectorExpression, limit)
    },

    /**
     * Stores query and results in database for tracking and analytics.
     * Uses transaction to ensure query and results are saved atomically.
     * @param query - Original text query
     * @param apikeyId - API key ID for access control
     * @param result - Search results to associate with the query
     */
    async saveKnowledgeQuery(query: string, apikeyId: string, result: Result) {
      await db.transaction(async (tx) => {
        const knowledgeQueryRepository = createKnowledgeQueryRepository(tx)
        const knowledgeQueryResultRepository =
          createKnowledgeQueryResultRepository(tx)

        const createdQuery = await knowledgeQueryRepository.createOne({
          apikeyId,
          queryText: query,
        })

        await knowledgeQueryResultRepository.createMany(
          result.map((r) => ({
            knowledgeChunkId: r.knowledgeChunk.id,
            knowledgeQueryId: createdQuery.id,
            score: r.score,
          })),
        )
      })
    },
  }
}

export { knowledgeQueryService }
