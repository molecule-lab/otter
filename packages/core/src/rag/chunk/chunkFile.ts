/**
 * File-specific chunking operations based on MIME type.
 *
 * Responsibilities:
 * - Route chunking operations based on file MIME type
 * - Handle MIME type-specific chunking strategies
 * - Provide error handling for unsupported file types
 */

import { chunkText } from "@/rag/chunk/chunkText"
import { ChunkedJob, ParsedJob } from "@/rag/types"

/**
 * Chunks file content based on MIME type.
 * Routes to appropriate chunking strategy for different file formats.
 * @param data - Parsed job containing file content and metadata
 * @returns Promise resolving to job with chunked text data
 * @throws Error if MIME type is not supported
 */
export async function chunkFile(data: ParsedJob): Promise<ChunkedJob> {
  switch (data.source.mimeType) {
    case "application/pdf":
      return chunkText(data)
    default:
      throw new Error(`Splitter not found for ${data.source.mimeType}`)
  }
}
