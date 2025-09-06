/**
 * Database package entry point and exports.
 *
 * Responsibilities:
 * - Re-export all public database components.
 * - Provide single import point for the database package.
 * - Maintain clean public interface for consumers.
 *
 * Exports:
 * - All exports from `./createDbConnection` - Database connection factory.
 * - All exports from `./types` - Database schema and instance types.
 */

export * from "./createDbConnection"
export type { DatabaseSchema, DatabaseInstance } from "./types"
