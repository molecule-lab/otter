/**
 * AI client factory for creating provider-specific AI clients.
 *
 * Responsibilities:
 * - Factory pattern for creating AI clients based on provider
 * - Centralized client creation logic
 * - Provider validation and error handling
 */

import { createOpenAIClient } from "@/ai/clients/open-ai"
import { AIClient } from "@/ai/types"

/**
 * Creates an AI client instance based on the specified provider.
 * @param provider - The AI provider name (e.g., "openai")
 * @param apiKey - The API key for the provider
 * @returns Configured AI client instance
 * @throws Error if provider is not supported or if required parameters are missing
 */
export function createAIClient(provider: string, apiKey: string): AIClient {
  // Validate required parameters before processing
  if (!apiKey || !provider) {
    throw new Error("API key and provider are required")
  }

  switch (provider) {
    case "openai":
      return createOpenAIClient(apiKey)
    default:
      throw new Error(`No AI client found for ${provider}`)
  }
}
