/**
 * Service for knowledge job business logic operations.
 *
 * Responsibilities:
 * - Process source files through the complete RAG pipeline (parse, chunk, embed).
 * - Manage knowledge job creation and processing workflow.
 * - Coordinate between AI processing and database persistence.
 * - Provide business logic layer for knowledge job operations.
 *
 * Exports:
 * - `knowledgeJobService(repository, ai)` - Factory function that creates a service instance
 *   for knowledge job business operations.
 */

import { createKnowledgeJobRepository } from "@/repositories/knowledge-job"
import { AIClient, processKnowledgeJob } from "@otter/core"
import { Source } from "@otter/db/types"

/**
 * Creates a knowledge jobs service instance with business logic operations.
 * @param knowledgeJobRepository - Repository instance for database operations
 * @param ai - AI client instance for embedding generation
 * @returns Service object with knowledge job processing methods
 */
export function knowledgeJobService(
  knowledgeJobRepository: ReturnType<typeof createKnowledgeJobRepository>,
  ai: AIClient,
) {
  return {
    /**
     * Processes source file through complete RAG pipeline and creates knowledge job record.
     * @param source - Source record containing file metadata
     * @returns Promise that resolves to processing result with job details
     */
    async processSource(source: Source) {
      const knowledgeJobWithSource =
        await knowledgeJobRepository.createOneWithSource({
          sourceId: source.id!,
        })

      const data = await processKnowledgeJob(knowledgeJobWithSource, ai)

      // Create database record for background processing job tracking
      return {
        message: "Source Create Successfully",
        id: data.id,
        chunks: data.chunks.count,
      }
    },
  }
}
