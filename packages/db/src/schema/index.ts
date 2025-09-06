/**
 * Database schema package entry point and exports.
 *
 * Responsibilities:
 * - Re-export all database schema definitions.
 * - Provide single import point for all schema modules.
 * - Maintain clean public interface for schema consumers.
 *
 * Exports:
 * - All exports from `./better-auth` - Authentication and user management schemas.
 * - All exports from `./knowledge` - Knowledge processing and job schemas.
 */

export * from "./better-auth"
export * from "./knowledge"
