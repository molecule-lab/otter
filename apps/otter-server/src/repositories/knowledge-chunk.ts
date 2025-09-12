/**
 * Knowledge chunk repository for database operations.
 *
 * Responsibilities:
 * - Handle database operations for knowledge text chunks
 * - Provide CRUD operations for chunk data persistence
 * - Support both single and batch chunk creation operations
 * - Maintain data integrity for chunk-text relationships
 */

import { knowledgeChunks } from "@otter/db/schema"
import { DatabaseInstance, KnowledgeChunk } from "@otter/db/types"

/**
 * Creates a knowledge chunk repository instance with database operations.
 * @param db - Database instance for chunk operations
 * @returns Repository object with chunk-specific database methods
 */
function createKnowledgeChunkRepository(db: DatabaseInstance) {
  return {
    /**
     * Creates a single knowledge chunk in the database.
     * @param chunk - Knowledge chunk data to insert
     * @returns Promise resolving to the created chunk record
     */
    async createOne(chunk: KnowledgeChunk) {
      const [created] = await db
        .insert(knowledgeChunks)
        .values(chunk)
        .returning()

      return created
    },

    /**
     * Creates multiple knowledge chunks in a single database operation.
     * @param chunks - Array of knowledge chunk data to insert
     * @returns Promise resolving to array of created chunk records
     */
    async createMany(chunks: Array<KnowledgeChunk>) {
      const createdChunks = await db
        .insert(knowledgeChunks)
        .values(chunks)
        .returning()

      return createdChunks
    },
  }
}

export { createKnowledgeChunkRepository }
