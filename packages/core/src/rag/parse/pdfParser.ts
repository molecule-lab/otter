/**
 * PDF document parsing implementation.
 *
 * Responsibilities:
 * - Extract text content from PDF files
 * - Handle file system operations for PDF access
 * - Provide structured text output for RAG processing
 */

import { readFileSync } from "fs"
import { join } from "path"
import { ParsedJob } from "@/rag/types"
import { KnowledgeJobWithSource } from "@otter/db/types"
import pdf from "pdf-parse"

/**
 * Parses PDF file and extracts text content.
 * Reads PDF from file system and uses pdf-parse library for text extraction.
 * @param data - Knowledge job containing source metadata with file location
 * @returns Promise resolving to job with extracted PDF text
 */
export async function pdfParse(
  data: KnowledgeJobWithSource,
): Promise<ParsedJob> {
  // Construct file path relative to upload directory
  const uploadDir = join(process.cwd(), "..", "..")
  const filePath = join(uploadDir, data.source.location)

  // Read PDF file from filesystem
  const dataBuffer = readFileSync(filePath)

  // Extract text content using pdf-parse
  const pdfData = await pdf(dataBuffer)

  return {
    ...data,
    parsed: { text: pdfData.text },
  }
}
