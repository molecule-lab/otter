/**
 * Document parsing orchestration for different source types.
 *
 * Responsibilities:
 * - Route parsing operations based on source type
 * - Coordinate document text extraction strategies
 * - Handle source type validation and error cases
 */

import { parseFile } from "@/rag/parse/parseFile"
import { ParsedJob } from "@/rag/types"
import { KnowledgeJobWithSource } from "@otter/db/types"

/**
 * Parses document content and extracts text for further processing.
 * Routes to appropriate parser based on source type.
 * Delegates file-based sources to MIME type-specific parsing logic.
 * @param data - Knowledge job with source metadata
 * @returns Promise resolving to job with extracted document text
 * @throws Error if source type is not supported
 */
export async function parse(data: KnowledgeJobWithSource): Promise<ParsedJob> {
  switch (data.source.sourceType) {
    case "file":
      return parseFile(data)
    default:
      throw new Error(
        `No parser found for the file type ${data.source.sourceType}`,
      )
  }
}
