/**
 * Knowledge item service for business logic operations.
 *
 * Responsibilities:
 * - Store processed knowledge data in the database
 * - Coordinate between knowledge items, chunks, and embeddings
 * - Handle transactional operations for data consistency
 * - Transform embedded job data into database records
 * - Manage the complete knowledge storage workflow
 */

import { createKnowledgeChunkRepository } from "@/repositories/knowledge-chunk"
import { createKnowledgeEmbeddingRepository } from "@/repositories/knowledge-embedding"
import { createKnowledgeItemRepository } from "@/repositories/knowledge-item"
import { EmbeddedJob } from "@otter/core/dist/rag/types"
import {
  DatabaseInstance,
  KnowledgeChunk,
  KnowledgeEmbedding,
} from "@otter/db/types"

// Todo fix the casing
/**
 * Creates a knowledge item service instance with business logic operations.
 * @param db - Database instance for knowledge item operations
 * @returns Service object with knowledge storage methods
 */
function knowledgeItemService(db: DatabaseInstance) {
  return {
    /**
     * Stores complete knowledge data from an embedded job in the database.
     * Uses a database transaction to ensure data consistency across all related tables.
     * @param embeddedJob - Processed job containing chunks and embeddings
     * @returns Promise resolving to the created knowledge item record
     */
    async storeKnowledge(embeddedJob: EmbeddedJob) {
      return db.transaction(async (tx) => {
        // Create repository instances for transactional operations
        const knowledgeItemRepository = createKnowledgeItemRepository(tx)
        const knowledgeChunkRepository = createKnowledgeChunkRepository(tx)
        const knowledgeEmbeddingRepository =
          createKnowledgeEmbeddingRepository(tx)

        // Store knowledge item metadata with processing configuration
        const knowledgeItem = await knowledgeItemRepository.createOne({
          knowledgeJobId: embeddedJob.id,
          sourceId: embeddedJob.sourceId,
          chunkOverlap: embeddedJob.chunks.chunkOverlap.toString(),
          chunksCount: embeddedJob.chunks.count.toString(),
          chunkSize: embeddedJob.chunks.chunkSize.toString(),
          embeddingModel: embeddedJob.chunks.embeddingModel,
          embeddingProvider: embeddedJob.chunks.embeddingProvider,
          splitter: embeddedJob.chunks.splitter,
          totalTokens: embeddedJob.chunks.totalTokens.toString(),
        })

        // Transform and store text chunks
        const serializedChunks: Array<KnowledgeChunk> =
          embeddedJob.chunks.list.map((chunk) => ({
            id: chunk.id,
            knowledgeItemId: knowledgeItem.id,
            text: chunk.text,
          }))

        await knowledgeChunkRepository.createMany(serializedChunks)

        // Transform and store vector embeddings
        const serializedEmbeddings: Array<KnowledgeEmbedding> =
          embeddedJob.chunks.list.map((chunk) => ({
            knowledgeChunkId: chunk.id,
            embedding: chunk.embedding.data[0].embedding,
            tokenCount: chunk.embedding.usage.total_tokens.toString(),
          }))

        await knowledgeEmbeddingRepository.createMany(serializedEmbeddings)

        return knowledgeItem
      })
    },
  }
}

export { knowledgeItemService }
