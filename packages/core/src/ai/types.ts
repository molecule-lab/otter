/**
 * AI client type definitions and interfaces.
 *
 * Responsibilities:
 * - Define standardized interface for AI service providers (OpenAI, Anthropic, etc.)
 * - Ensure type safety across different AI implementations
 * - Provide consistent API for embedding operations
 */

import OpenAI from "openai"

/**
 * Standardized interface for AI service providers.
 *
 * This interface ensures consistent behavior across different AI providers
 * while maintaining compatibility with OpenAI's response format.
 */
export interface AIClient {
  /** Name of the AI provider (e.g., "openai", "anthropic") */
  provider: string

  /** Specific embedding model identifier used by the provider */
  embeddingModel: string

  /**
   * Creates embeddings for the given input text.
   * @param input - The text to generate embeddings for
   * @returns Promise resolving to OpenAI-compatible embedding response
   */
  createEmbedding(
    input: string,
  ): Promise<OpenAI.Embeddings.CreateEmbeddingResponse>
}
