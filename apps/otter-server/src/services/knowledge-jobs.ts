/**
 * Service for knowledge job business logic operations.
 *
 * Responsibilities:
 * - Handle file upload and storage operations for knowledge processing.
 * - Manage knowledge job creation and processing workflow.
 * - Coordinate between file system operations and database persistence.
 * - Provide business logic layer for knowledge job operations.
 *
 * Exports:
 * - `knowledgeJobsService(repository)` - Factory function that creates a service instance
 *   for knowledge job business operations.
 */

import { createWriteStream } from "fs"
import fs from "fs/promises"
import { join } from "path"
import { createKnowledgeJobsRepository } from "@/repositories/knowledge-jobs"
import { MultipartFile } from "@fastify/multipart"

/**
 * Creates a knowledge jobs service instance with business logic operations.
 * @param knowledgeJobsRepository - Repository instance for database operations
 * @returns Service object with knowledge job processing methods
 */
export function knowledgeJobsService(
  knowledgeJobsRepository: ReturnType<typeof createKnowledgeJobsRepository>,
) {
  return {
    /**
     * Processes uploaded file and creates knowledge job record.
     * @param file - Multipart file object from request
     * @param apiKeyId - API key ID that owns the job
     * @returns Promise that resolves to created knowledge job record
     */
    async processFile(file: MultipartFile, apiKeyId: string) {
      // Create uploads directory relative to project root for file storage
      const uploadDir = join(process.cwd(), "..", "..", "__uploads__")
      await fs.mkdir(uploadDir, { recursive: true })

      // Build the file path for local storage
      const filePath = join(uploadDir, file.filename)

      // Stream file to disk to avoid loading entire file into memory
      await new Promise((resolve, reject) => {
        const ws = createWriteStream(filePath)
        file?.file.pipe(ws)
        ws.on("finish", resolve)
        ws.on("error", reject)
      })

      // Create database record for background processing job tracking
      return await knowledgeJobsRepository.create({
        apikeyId: apiKeyId || "",
        fileName: file.filename,
        filePath: `__uploads__/${file?.filename}`,
        fileType: file.mimetype,
      })
    },
  }
}
