/**
 * Document parsing orchestration for different file types.
 *
 * Responsibilities:
 * - Route parsing operations based on file type
 * - Coordinate document text extraction strategies
 * - Handle file type validation and error cases
 */

import { pdfParse } from "@/rag/parse/pdfParser"
import { KnowledgeJob, ParsedJob } from "@/rag/types"

/**
 * Parses document content and extracts text for further processing.
 * Routes to appropriate parser based on file type.
 * @param data - Knowledge job with file metadata
 * @returns Promise resolving to job with extracted document text
 * @throws Error if file type is not supported
 */
export async function parse(data: KnowledgeJob): Promise<ParsedJob> {
  switch (data.fileType) {
    case "application/pdf":
      return await pdfParse(data)
    default:
      throw new Error(`No parser found for the file type ${data.fileType}`)
  }
}
