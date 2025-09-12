/**
 * Service for knowledge job business logic operations.
 *
 * Responsibilities:
 * - Create knowledge job records with source associations in the database.
 * - Process knowledge jobs through the complete RAG pipeline (parse, chunk, embed).
 * - Manage job status updates (queued → processing → completed/failed).
 * - Coordinate between AI processing and database persistence.
 * - Handle error scenarios and job failure tracking.
 * - Provide business logic layer for knowledge job operations.
 *
 * Exports:
 * - `knowledgeJobService(repository, ai)` - Factory function that creates a service instance
 *   for knowledge job business operations.
 */

import { createKnowledgeJobRepository } from "@/repositories/knowledge-job"
import { AIClient, processKnowledgeJob } from "@otter/core"
import { KnowledgeJobWithSource, Source } from "@otter/db/types"

/**
 * Creates a knowledge jobs service instance with business logic operations.
 * @param knowledgeJobRepository - Repository instance for database operations
 * @param ai - AI client instance for embedding generation
 * @returns Service object with knowledge job processing methods
 */
function knowledgeJobService(
  knowledgeJobRepository: ReturnType<typeof createKnowledgeJobRepository>,
  ai: AIClient,
) {
  return {
    /**
     * Creates a new knowledge job record in the database with source association.
     * @param source - Source record to associate with the knowledge job
     * @returns Promise resolving to knowledge job with embedded source data
     */
    async createJob(source: Source) {
      return knowledgeJobRepository.createOneWithSource({
        sourceId: source.id!,
      })
    },

    /**
     * Processes a knowledge job through the complete RAG pipeline.
     * Updates job status throughout the process and handles errors appropriately.
     * @param knowledgeJobWithSource - Knowledge job with associated source data
     * @returns Promise resolving to processed job data with embeddings
     * @throws Error if job processing fails
     */
    async processJob(knowledgeJobWithSource: KnowledgeJobWithSource) {
      try {
        if (!knowledgeJobWithSource || !knowledgeJobWithSource.id) {
          throw Error("Job is not defined")
        }

        // Update job status to processing
        await knowledgeJobRepository.updateStatus(
          knowledgeJobWithSource.id,
          "processing",
        )

        // Process through RAG pipeline: parse → chunk → embed
        const data = await processKnowledgeJob(knowledgeJobWithSource, ai)

        // Mark job as completed
        await knowledgeJobRepository.updateStatus(
          knowledgeJobWithSource.id,
          "completed",
        )

        return data
      } catch (error) {
        // Mark job as failed with error message
        if (knowledgeJobWithSource.id) {
          await knowledgeJobRepository.markFailed(
            knowledgeJobWithSource.id,
            error instanceof Error ? error.message : "Unknown error",
          )
        }

        throw error
      }
    },
  }
}

export { knowledgeJobService }
