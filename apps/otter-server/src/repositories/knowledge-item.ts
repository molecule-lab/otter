/**
 * Knowledge item repository for database operations.
 *
 * Responsibilities:
 * - Handle database operations for knowledge item metadata
 * - Provide CRUD operations for knowledge item persistence
 * - Store processing configuration and statistics for knowledge jobs
 * - Maintain relationships between knowledge items and their chunks/embeddings
 */

import { knowledgeItems } from "@otter/db/schema"
import { DatabaseInstance, KnowledgeItem } from "@otter/db/types"

/**
 * Creates a knowledge item repository instance with database operations.
 * @param db - Database instance for knowledge item operations
 * @returns Repository object with knowledge item-specific database methods
 */
function createKnowledgeItemRepository(db: DatabaseInstance) {
  return {
    /**
     * Creates a single knowledge item in the database.
     * @param knowledgeItem - Knowledge item data to insert
     * @returns Promise resolving to the created knowledge item record
     */
    async createOne(knowledgeItem: KnowledgeItem) {
      const [created] = await db
        .insert(knowledgeItems)
        .values(knowledgeItem)
        .returning()

      return created
    },
  }
}

export { createKnowledgeItemRepository }
