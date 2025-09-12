/**
 * OpenAI client implementation for AI operations.
 *
 * Responsibilities:
 * - Implement OpenAI-specific AI client functionality
 * - Handle OpenAI API interactions for embeddings
 * - Provide standardized interface for OpenAI services
 */

import { AIClient } from "@/ai/types"
import OpenAI from "openai"

/**
 * Creates an OpenAI client instance with embedding capabilities.
 *
 * This factory function initializes the OpenAI SDK and returns a configured
 * AIClient implementation that can be used throughout the RAG pipeline.
 *
 * @param apiKey - OpenAI API key for authentication (starts with 'sk-')
 * @returns AIClient implementation using OpenAI services with text-embedding-3-small model
 * @throws Error if API key is invalid or API request fails
 */
export function createOpenAIClient(apiKey: string): AIClient {
  // Initialize OpenAI client with provided API key
  const client = new OpenAI({
    apiKey,
  })

  return {
    provider: "openai",
    embeddingModel: "text-embedding-3-small",
    /**
     * Creates embeddings using OpenAI's text-embedding-3-small model.
     * @param input - Text to generate embeddings for
     * @returns Promise resolving to OpenAI embedding response
     */
    async createEmbedding(input: string) {
      return client.embeddings.create({
        model: "text-embedding-3-small",
        input,
      })
    },
  }
}
