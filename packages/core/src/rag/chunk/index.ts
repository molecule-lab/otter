/**
 * Text chunking orchestration for different document types.
 *
 * Responsibilities:
 * - Route chunking operations based on file type
 * - Coordinate text splitting strategies
 * - Handle file type validation and error cases
 */

import { chunkText } from "@/rag/chunk/chunkText"
import { ChunkedJob, ParsedJob } from "@/rag/types"

/**
 * Chunks parsed document text into manageable segments.
 * Routes to appropriate chunking strategy based on file type.
 * @param data - Parsed job containing document text
 * @returns Promise resolving to job with chunked text data
 * @throws Error if file type is not supported
 */
export async function chunk(data: ParsedJob): Promise<ChunkedJob> {
  switch (data.fileType) {
    case "application/pdf": {
      return await chunkText(data)
    }
    default:
      throw new Error(`Splitter not found for ${data.fileType}`)
  }
}
