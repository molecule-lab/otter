/**
 * Text chunking orchestration for different document types.
 *
 * Responsibilities:
 * - Route chunking operations based on source type
 * - Coordinate text splitting strategies for different file formats
 * - Handle source type validation and error cases
 */

import { chunkFile } from "@/rag/chunk/chunkFile"
import { ChunkedJob, ParsedJob } from "@/rag/types"

/**
 * Chunks parsed document text into manageable segments.
 * Routes to appropriate chunking strategy based on source type.
 * Delegates file-based sources to MIME type-specific chunking logic.
 * @param data - Parsed job containing document text
 * @returns Promise resolving to job with chunked text data
 * @throws Error if source type is not supported
 */
export async function chunk(data: ParsedJob): Promise<ChunkedJob> {
  switch (data.source.sourceType) {
    case "file": {
      return chunkFile(data)
    }
    default:
      throw new Error(`Splitter not found for ${data.source.sourceType}`)
  }
}
