/**
 * API package entry point and exports.
 *
 * Responsibilities:
 * - Re-export all public API components.
 * - Provide single import point for the API package.
 * - Maintain clean public interface for consumers.
 *
 * Exports:
 * - All exports from `./trpc` - Router and procedure definitions.
 * - All exports from `./context` - Context creation and types.
 */

export * from "./trpc"
export * from "./context"
