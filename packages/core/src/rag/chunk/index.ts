/**
 * Text chunking orchestration for different document types.
 *
 * Responsibilities:
 * - Route chunking operations based on source type
 * - Coordinate text splitting strategies for different file formats
 * - Handle source type validation and error cases
 */

import { chunkText } from "@/rag/chunk/chunkText"
import { ChunkedJob, ParsedJob } from "@/rag/types"

/**
 * Chunks parsed document text into manageable segments.
 * Routes to appropriate chunking strategy based on source type.
 * Currently supports file-based sources with text chunking.
 * @param data - Parsed job containing document text
 * @returns Promise resolving to job with chunked text data
 * @throws Error if source type is not supported
 */
export async function chunk(data: ParsedJob): Promise<ChunkedJob> {
  // Todo add mimetype logic
  switch (data.source.sourceType) {
    case "file": {
      return chunkText(data)
    }
    default:
      throw new Error(`Splitter not found for ${data.source.sourceType}`)
  }
}
