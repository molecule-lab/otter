/**
 * Text chunking implementation using LangChain's RecursiveCharacterTextSplitter.
 *
 * This module provides configurable text chunking functionality for RAG (Retrieval-Augmented Generation)
 * processing. It splits large documents into smaller, manageable chunks while preserving semantic context.
 *
 * Responsibilities:
 * - Split large text documents into manageable chunks for embedding and retrieval
 * - Maintain semantic coherence through configurable overlap strategy
 * - Provide consistent chunking parameters configurable via environment variables
 * - Transform raw text into structured chunk objects with metadata
 * - Support configurable chunk size and overlap for different use cases
 *
 * Configuration:
 * - CHUNK_SIZE: Maximum characters per chunk (default: 800)
 * - CHUNK_OVERLAP: Overlap between chunks for context preservation (default: 80)
 */

import { ChunkedJob, ParsedJob } from "@/rag/types"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"

/**
 * Configured text splitter with environment-configurable parameters for RAG processing.
 *
 * Uses LangChain's RecursiveCharacterTextSplitter which:
 * - Attempts to split on semantic boundaries (paragraphs, sentences, words)
 * - Falls back to character-level splitting when semantic boundaries aren't available
 * - Maintains context through configurable overlap between chunks
 * - Optimizes chunk sizes for embedding model input limits
 *
 * Parameters are loaded from environment variables with sensible defaults:
 * - chunkSize: Maximum characters per chunk (CHUNK_SIZE env var, default: 800)
 * - chunkOverlap: Overlap between chunks (CHUNK_OVERLAP env var, default: 80)
 */

export const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: parseInt(process.env.CHUNK_SIZE || "800"), // Maximum characters per chunk
  chunkOverlap: parseInt(process.env.CHUNK_OVERLAP || "80"), // Overlap between chunks for context preservation
})

/**
 * Splits document text into chunks using the configured text splitter.
 *
 * This function processes parsed document text and converts it into structured chunks
 * suitable for embedding and retrieval operations. Each chunk is wrapped in a
 * standardized object format with metadata.
 *
 * @param data - Parsed job containing document text to be chunked
 * @returns Promise resolving to ChunkedJob with structured chunk data including:
 *   - list: Array of chunk objects with text content
 *   - count: Total number of chunks created
 *
 * ```
 */
export async function chunkText(data: ParsedJob): Promise<ChunkedJob> {
  // Split the document text into chunks using the configured splitter
  const chunks = await textSplitter.splitText(data.parsed.text)

  return {
    ...data,
    chunks: {
      // Transform string chunks into structured objects with text property
      // This format is required for downstream embedding and retrieval operations
      list: chunks.map((chunk) => ({
        text: chunk,
      })),
      count: chunks.length,
    },
  }
}
