/**
 * Knowledge query result repository for database operations.
 *
 * Responsibilities:
 * - Handle database operations for query result records
 * - Store relationships between queries and matching chunks
 * - Support batch creation of query results for efficient storage
 */

import { knowledgeQueryResult } from "@otter/db/schema"
import { DatabaseInstance, KnowledgeQueryResult } from "@otter/db/types"

/**
 * Creates a knowledge query result repository instance with database operations.
 * @param db - Database instance for query result operations
 * @returns Repository object with query result-specific database methods
 */
function createKnowledgeQueryResultRepository(db: DatabaseInstance) {
  return {
    /**
     * Creates multiple query result records in a single database operation.
     * Links query results to their corresponding queries and matching chunks.
     * @param queryResults - Array of query result data to insert
     * @returns Promise resolving to array of created query result records
     */
    async createMany(queryResults: Array<KnowledgeQueryResult>) {
      const createdQueryResult = await db
        .insert(knowledgeQueryResult)
        .values(queryResults)
        .returning()

      return createdQueryResult
    },
  }
}

export { createKnowledgeQueryResultRepository }
