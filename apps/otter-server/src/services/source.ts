/**
 * Service for source file management and storage operations.
 *
 * Responsibilities:
 * - Handle file upload and storage operations for document sources.
 * - Manage file system operations for source file persistence.
 * - Coordinate between file system operations and database persistence.
 * - Provide business logic layer for source file operations.
 *
 * Exports:
 * - `sourceService(repository)` - Factory function that creates a service instance
 *   for source file management operations.
 */

import { createWriteStream } from "fs"
import fs from "fs/promises"
import { join } from "path"
import { createSourceRepository } from "@/repositories/source"
import { MultipartFile } from "@fastify/multipart"

/**
 * Creates a source service instance with file management operations.
 * @param sourceRepository - Repository instance for database operations
 * @returns Service object with source file management methods
 */
export function sourceService(
  sourceRepository: ReturnType<typeof createSourceRepository>,
) {
  return {
    /**
     * Handles file upload and creates source record in database.
     * @param file - Multipart file object from request
     * @param apikeyId - API key ID that owns the source
     * @returns Promise that resolves to created source record
     */
    async createSource(file: MultipartFile, apikeyId: string) {
      // Create uploads directory relative to project root for file storage
      const uploadDir = join(process.cwd(), "..", "..", "__uploads__")
      await fs.mkdir(uploadDir, { recursive: true })

      // Build the file path for local storage
      const filePath = join(uploadDir, file.filename)

      // Stream file to disk to avoid loading entire file into memory
      await new Promise<void>((resolve, reject) => {
        const ws = createWriteStream(filePath)
        file?.file.pipe(ws)
        ws.on("finish", () => resolve())
        ws.on("error", reject)
      })

      return sourceRepository.createOne({
        apikeyId,
        location: `__uploads__/${file?.filename}`,
        sourceType: "file",
        mimeType: file.mimetype,
        fileName: file.filename,
      })
    },
  }
}
