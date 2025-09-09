/**
 * Fastify plugin to provide AI client service to the app layer.
 *
 * Responsibilities:
 * - Create an AI client instance using the core package factory.
 * - Decorate the Fastify instance with `ai` for use across routes and handlers.
 * - Augment Fastify types to expose `fastify.ai` with correct typing.
 * - Declare plugin metadata: name `ai`.
 */

import { AIClient, createAIClient } from "@otter/core"
import { FastifyInstance } from "fastify"
import fp from "fastify-plugin"

declare module "fastify" {
  interface FastifyInstance {
    ai: AIClient
  }
}

/**
 * AI plugin that creates and registers AI client with Fastify instance.
 * @param fastify - Fastify instance to decorate with AI client
 */
async function aiPlugin(fastify: FastifyInstance) {
  // TODO: Make API key configurable through environment variables
  const aiClient = createAIClient("openai", "dummy-key")

  fastify.decorate("ai", aiClient)
}

export default fp(aiPlugin, { name: "ai" })
