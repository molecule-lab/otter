/**
 * Knowledge query repository for database operations.
 *
 * Responsibilities:
 * - Handle database operations for search query records
 * - Store user queries with API key associations for tracking
 * - Support query history and analytics functionality
 */

import { knowledgeQuery } from "@otter/db/schema"
import { DatabaseInstance, KnowledgeQuery } from "@otter/db/types"

/**
 * Creates a knowledge query repository instance with database operations.
 * @param db - Database instance for query operations
 * @returns Repository object with query-specific database methods
 */
function createKnowledgeQueryRepository(db: DatabaseInstance) {
  return {
    /**
     * Creates a single knowledge query record in the database.
     * Associates the query with an API key for access control and tracking.
     * @param query - Query data to insert including text and API key ID
     * @returns Promise resolving to the created query record
     */
    async createOne(query: KnowledgeQuery) {
      const [created] = await db
        .insert(knowledgeQuery)
        .values(query)
        .returning()

      return created
    },
  }
}

export { createKnowledgeQueryRepository }
