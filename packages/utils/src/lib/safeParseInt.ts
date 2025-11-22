/**
 * Utility functions for safe parsing and type conversion operations.
 *
 * Responsibilities:
 * - Provide safe parsing utilities that handle undefined values and invalid input
 * - Prevent runtime errors from invalid type conversions
 * - Return sensible fallback values when parsing fails
 *
 * Exports:
 * - `safeParseInt` - Safely parses string to integer with fallback value
 */

/**
 * Safely parses a string value to an integer, returning a fallback if parsing fails.
 * Handles undefined values and NaN results gracefully.
 * @param value - String value to parse, or undefined
 * @param fallback - Default value to return if parsing fails or value is undefined
 * @returns Parsed integer value or fallback if parsing fails
 */
function safeParseInt(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback
  }
  const parsed = parseInt(value)
  return Number.isNaN(parsed) ? fallback : parsed
}

export { safeParseInt }
