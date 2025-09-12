/**
 * Repository factory for creating database access layer instances.
 *
 * Responsibilities:
 * - Centralize repository creation and dependency injection
 * - Provide typed repository instances for all data access operations
 * - Decouple business logic from specific database implementations
 * - Enable consistent repository pattern across the application
 *
 * Exports:
 * - `createRepositories(db)` - Factory function that creates all repository instances
 */

import { createKnowledgeChunkRepository } from "@/repositories/knowledge-chunk"
import { createKnowledgeEmbeddingRepository } from "@/repositories/knowledge-embedding"
import { createKnowledgeItemRepository } from "@/repositories/knowledge-item"
import { createKnowledgeJobRepository } from "@/repositories/knowledge-job"
import { createSourceRepository } from "@/repositories/source"
import { DatabaseInstance } from "@otter/db/types"

/**
 * Creates a complete set of repository instances for data access operations.
 * @param db - Database instance for repository operations
 * @returns Object containing all repository instances for knowledge processing
 */
function createRepositories(db: DatabaseInstance) {
  return {
    knowledgeJob: createKnowledgeJobRepository(db),
    source: createSourceRepository(db),
    knowledgeItem: createKnowledgeItemRepository(db),
    knowledgeChunks: createKnowledgeChunkRepository(db),
    knowledgeEmbedding: createKnowledgeEmbeddingRepository(db),
  }
}

export { createRepositories }
