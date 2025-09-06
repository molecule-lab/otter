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

function createKnowledgeJobsRepository(fastify: FastifyInstance) {
  const db = fastify.db

  return {
    async create(knowledgeJob: KnowledgeJob) {
      return db.insert(knowledge_jobs).values(knowledgeJob).returning()
    },

    async update(id: string, changes: Partial<KnowledgeJob>) {
      return db
        .update(knowledge_jobs)
        .set(changes)
        .where(eq(knowledge_jobs.id, id))
        .returning()
    },

    async updateStatus(id: string, status: KnowledgeJob["status"]) {
      return this.update(id, { status })
    },

    async markFailed(id: string, error: string) {
      return this.update(id, { status: "failed", error })
    },
  }
}

export { createKnowledgeJobsRepository }
