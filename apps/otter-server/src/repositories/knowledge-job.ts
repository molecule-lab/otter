/**
 * Repository for knowledge job data access operations.
 *
 * Responsibilities:
 * - Provide CRUD operations for knowledge jobs in the database.
 * - Handle knowledge job status updates and error tracking.
 * - Abstract database operations behind a clean interface.
 * - Return typed results using Drizzle ORM with proper error handling.
 *
 * Exports:
 * - `createKnowledgeJobRepository(fastify)` - Factory function that creates a repository instance
 *   for knowledge job database operations.
 */

import { knowledgeJobs, sources } from "@otter/db/schema"
import { DatabaseInstance, KnowledgeJob } from "@otter/db/types"
import { eq, getTableColumns } from "drizzle-orm"

/**
 * Creates a knowledge jobs repository instance for database operations.
 * @param db - Database instance for data persistence
 * @returns Repository object with CRUD operations for knowledge jobs
 */
function createKnowledgeJobRepository(db: DatabaseInstance) {
  return {
    /**
     * Creates a new knowledge job record in the database.
     * @param knowledgeJob - Knowledge job data to insert
     * @returns Promise that resolves to array of created job records
     */
    async createOne(knowledgeJob: KnowledgeJob) {
      const [created] = await db
        .insert(knowledgeJobs)
        .values(knowledgeJob)
        .returning()

      return created
    },

    /**
     * Creates a new knowledge job and immediately retrieves it with associated source data.
     * @param knowledgeJob - Knowledge job data to insert
     * @returns Promise that resolves to job record with embedded source information
     */
    async createOneWithSource(knowledgeJob: KnowledgeJob) {
      const job = await this.createOne(knowledgeJob)

      const [jobWithSource] = await db
        .select({ ...getTableColumns(knowledgeJobs), source: sources })
        .from(knowledgeJobs)
        .innerJoin(sources, eq(knowledgeJobs.sourceId, sources.id))
        .where(eq(knowledgeJobs.id, job.id))

      return jobWithSource
    },

    /**
     * Updates an existing knowledge job with partial data.
     * @param id - Knowledge job ID to update
     * @param changes - Partial knowledge job data to update
     * @returns Promise that resolves to array of updated job records
     */
    async update(id: string, changes: Partial<KnowledgeJob>) {
      return db
        .update(knowledgeJobs)
        .set(changes)
        .where(eq(knowledgeJobs.id, id))
        .returning()
    },

    /**
     * Updates the status of a knowledge job.
     * @param id - Knowledge job ID to update
     * @param status - New status value
     * @returns Promise that resolves to array of updated job records
     */
    async updateStatus(id: string, status: KnowledgeJob["status"]) {
      return this.update(id, { status })
    },

    /**
     * Marks a knowledge job as failed with error message.
     * @param id - Knowledge job ID to mark as failed
     * @param error - Error message describing the failure
     * @returns Promise that resolves to array of updated job records
     */
    async markFailed(id: string, error: string) {
      return this.update(id, { status: "failed", error })
    },
  }
}

export { createKnowledgeJobRepository }
