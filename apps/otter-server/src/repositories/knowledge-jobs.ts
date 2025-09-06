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
 * - `createKnowledgeJobsRepository(fastify)` - Factory function that creates a repository instance
 *   for knowledge job database operations.
 */

import { knowledge_jobs } from "@otter/db/schema"
import { eq, InferInsertModel } from "drizzle-orm"
import { FastifyInstance } from "fastify"

type KnowledgeJob = InferInsertModel<typeof knowledge_jobs>

/**
 * Creates a knowledge jobs repository instance for database operations.
 * @param fastify - Fastify instance with database connection
 * @returns Repository object with CRUD operations for knowledge jobs
 */
function createKnowledgeJobsRepository(fastify: FastifyInstance) {
  const db = fastify.db

  return {
    /**
     * Creates a new knowledge job record in the database.
     * @param knowledgeJob - Knowledge job data to insert
     * @returns Promise that resolves to array of created job records
     */
    async create(knowledgeJob: KnowledgeJob) {
      return db.insert(knowledge_jobs).values(knowledgeJob).returning()
    },

    /**
     * Updates an existing knowledge job with partial data.
     * @param id - Knowledge job ID to update
     * @param changes - Partial knowledge job data to update
     * @returns Promise that resolves to array of updated job records
     */
    async update(id: string, changes: Partial<KnowledgeJob>) {
      return db
        .update(knowledge_jobs)
        .set(changes)
        .where(eq(knowledge_jobs.id, id))
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

export { createKnowledgeJobsRepository }
