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
import { createKnowledgeJobsRepository } from "@/src/repositories/knowledge-jobs"
import { MultipartFile } from "@fastify/multipart"

export function knowledgeJobsService(
  knowledgeJobsRepository: ReturnType<typeof createKnowledgeJobsRepository>,
) {
  return {
    async processFile(file: MultipartFile, apiKeyId: string) {
      const uploadDir = join(process.cwd(), "..", "..", "__uploads__")
      await fs.mkdir(uploadDir, { recursive: true })

      // Build the file path
      const filePath = join(uploadDir, file.filename)

      // Write the file to disk
      await new Promise((resolve, reject) => {
        const ws = createWriteStream(filePath)
        file?.file.pipe(ws)
        ws.on("finish", resolve)
        ws.on("error", reject)
      })

      // Insert JOB into the
      return await knowledgeJobsRepository.create({
        apikeyId: apiKeyId || "",
        fileName: file.filename,
        filePath: `__uploads__/${file?.filename}`,
        fileType: file.mimetype,
      })
    },
  }
}
