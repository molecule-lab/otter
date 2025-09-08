/**
 * Text chunking implementation using LangChain's RecursiveCharacterTextSplitter.
 *
 * Responsibilities:
 * - Split large text documents into manageable chunks
 * - Maintain semantic coherence through overlap strategy
 * - Provide consistent chunking parameters for RAG processing
 */

import { ChunkedJob, ParsedJob } from "@/rag/types"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"

/**
 * Configured text splitter with optimized parameters for RAG processing.
 * Uses recursive character splitting to maintain semantic boundaries.
 */

// Todo: Make configurable
export const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 800, // Maximum characters per chunk
  chunkOverlap: 60, // Overlap between chunks for context preservation
})

/**
 * Splits document text into chunks using the configured text splitter.
 * @param data - Parsed job containing document text to be chunked
 * @returns Promise resolving to job with chunked text data
 */
export async function chunkText(data: ParsedJob): Promise<ChunkedJob> {
  const chunks = await textSplitter.splitText(data.document.text)
  return {
    ...data,
    chunks: { list: chunks, count: chunks.length },
  }
}
