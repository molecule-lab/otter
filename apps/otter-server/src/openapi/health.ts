/**
 * Health check OpenAPI schema definition.
 *
 * Responsibilities:
 * - Define OpenAPI schema for health check endpoint response validation.
 * - Provide TypeBox-based schema for runtime type checking and documentation.
 * - Support service availability monitoring and uptime checks.
 *
 * Exports:
 * - `healthSchema` for health check endpoint validation
 */

import { Type } from "@fastify/type-provider-typebox"

/**
 * Fastify schema for health check endpoint.
 * Defines response validation using TypeBox for runtime type checking.
 */
const healthSchema = {
  tags: ["Health"],
  response: {
    200: Type.Object({
      message: Type.String(),
    }),
  },
}

export { healthSchema }
