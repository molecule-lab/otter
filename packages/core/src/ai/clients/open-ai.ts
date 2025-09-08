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
 * @param apiKey - OpenAI API key for authentication
 * @returns AIClient implementation using OpenAI services
 */
export function createOpenAIClient(apiKey: string): AIClient {
  const client = new OpenAI({
    apiKey,
  })

  return {
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
