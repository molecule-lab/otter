/**
 * Document parsing orchestration for different source types.
 *
 * Responsibilities:
 * - Route parsing operations based on source type
 * - Coordinate document text extraction strategies
 * - Handle source type validation and error cases
 */

import { pdfParse } from "@/rag/parse/pdfParser"
import { ParsedJob } from "@/rag/types"
import { KnowledgeJobWithSource } from "@otter/db/types"

/**
 * Parses document content and extracts text for further processing.
 * Routes to appropriate parser based on source type.
 * Currently supports file-based sources with PDF parsing.
 * @param data - Knowledge job with source metadata
 * @returns Promise resolving to job with extracted document text
 * @throws Error if source type is not supported
 */
export async function parse(data: KnowledgeJobWithSource): Promise<ParsedJob> {
  switch (data.source.sourceType) {
    // Todo Implement Mime type based logic here
    case "file":
      return pdfParse(data)
    default:
      throw new Error(
        `No parser found for the file type ${data.source.sourceType}`,
      )
  }
}
