/**
 * Rate limiting plugin for the Otter server.
 *
 * This plugin provides configurable rate limiting functionality that:
 * - Limits the number of requests per minute based on environment configuration
 * - Uses the MAX_REQUEST_PER_MINUTE environment variable for configuration
 * - Applies rate limiting across all routes with a 1-minute time window
 * - Provides low-overhead protection against abuse and DoS attacks
 *
 * Configuration is dynamically loaded from the Fastify instance config,
 * allowing for runtime configuration changes without code modifications.
 *
 * @see {@link https://github.com/fastify/fastify-rate-limit}
 */

import fastifyRateLimit from "@fastify/rate-limit"
import { FastifyInstance } from "fastify"
import fp from "fastify-plugin"

/**
 * Rate limiting plugin implementation.
 *
 * Registers the fastify-rate-limit plugin with configuration from environment variables.
 * The rate limit is dynamically configured using the MAX_REQUEST_PER_MINUTE value
 * from the Fastify instance configuration.
 */
async function rateLimitPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyRateLimit, {
    max: fastify.config.MAX_REQUEST_PER_MINUTE,
    timeWindow: "1 minute",
  })
}

export default fp(rateLimitPlugin, {
  name: "rate-limit",
})
