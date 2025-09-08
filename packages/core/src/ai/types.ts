/**
 * AI client type definitions and interfaces.
 *
 * Responsibilities:
 * - Define standardized interface for AI service providers
 * - Ensure type safety across different AI implementations
 * - Provide consistent API for embedding operations
 */

import OpenAI from "openai"

export interface AIClient {
  /**
   * Creates embeddings for the given input text.
   * @param input - The text to generate embeddings for
   * @returns Promise resolving to OpenAI-compatible embedding response
   */
  createEmbedding(
    input: string,
  ): Promise<OpenAI.Embeddings.CreateEmbeddingResponse>
}
