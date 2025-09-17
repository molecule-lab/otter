/**
 * File-specific parsing operations based on MIME type.
 *
 * Responsibilities:
 * - Route parsing operations based on file MIME type
 * - Handle MIME type-specific parsing strategies
 * - Provide error handling for unsupported file types
 */

import { pdfParse } from "@/rag/parse/pdfParser"
import { ParsedJob } from "@/rag/types"
import { KnowledgeJobWithSource } from "@otter/db/types"

/**
 * Parses file content based on MIME type.
 * Routes to appropriate parser for different file formats.
 * @param data - Knowledge job with file source and metadata
 * @returns Promise resolving to job with extracted text content
 * @throws Error if MIME type is not supported
 */
export async function parseFile(
  data: KnowledgeJobWithSource,
): Promise<ParsedJob> {
  switch (data.source.mimeType) {
    case "application/pdf":
      return pdfParse(data)
    default:
      throw new Error(
        ` No parser found for the mimetype ${data.source.mimeType}`,
      )
  }
}
