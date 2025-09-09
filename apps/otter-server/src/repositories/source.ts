/**
 * Repository for source data access operations.
 *
 * Responsibilities:
 * - Provide basic create operations for sources in the database.
 * - Handle source file metadata storage and retrieval.
 * - Abstract database operations behind a clean interface.
 * - Return typed results using Drizzle ORM with proper error handling.
 *
 * Exports:
 * - `createSourceRepository(db)` - Factory function that creates a repository instance
 *   for source database operations.
 */

import { sources } from "@otter/db/schema"
import { DatabaseInstance, Source } from "@otter/db/types"

/**
 * Creates a sources repository instance for database operations.
 * @param db - Database instance for data persistence
 * @returns Repository object with create operations for sources
 */
function createSourceRepository(db: DatabaseInstance) {
  return {
    /**
     * Creates a new source record in the database.
     * @param source - Source data to insert
     * @returns Promise that resolves to the created source record
     */
    async createOne(source: Source) {
      const [created] = await db.insert(sources).values(source).returning()
      return created
    },
  }
}

export { createSourceRepository }
