/**
 * OpenAPI utility functions and shared schemas.
 *
 * Responsibilities:
 * - Provide reusable error schema factory for consistent error responses across endpoints.
 * - Generate standardized error response schemas with configurable status codes.
 * - Support consistent error handling patterns throughout the OpenAPI documentation.
 *
 * Exports:
 * - `errorSchema` function for generating error response schemas
 */

import { OpenAPIV3 } from "openapi-types"

/**
 * Factory function for generating standardized error response schemas.
 * @param defaultStatusCode - HTTP status code to use as default in schema
 * @returns OpenAPI schema object for error responses with consistent structure
 */
const errorSchema = (defaultStatusCode: number): OpenAPIV3.SchemaObject => ({
  type: "object",
  properties: {
    status: { type: "string", default: "error" },
    statusCode: { type: "number", default: defaultStatusCode },
    code: { type: "string" },
    message: { type: "string" },
  },
})

export { errorSchema }
