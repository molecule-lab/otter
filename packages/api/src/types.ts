/**
 * TypeScript type definitions and module augmentations.
 *
 * Responsibilities:
 * - Extend Fastify module with custom properties.
 * - Define database connection types for type safety.
 * - Provide shared type definitions across the API package.
 * - Enable TypeScript intellisense for custom Fastify decorators.
 *
 * Exports:
 * - Module augmentation for Fastify interface with database property.
 */

import { DatabaseInstance } from "@otter/db"

declare module "fastify" {
  interface FastifyInstance {
    db: DatabaseInstance
  }
}
