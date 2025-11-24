/**
 * Fastify plugin to provide global error handling for the application.
 *
 * Responsibilities:
 * - Catch and handle all unhandled errors across the application.
 * - Log error details including request context for debugging.
 * - Return consistent error response format with statusCode, code, message, and errorTrace.
 * - Handle both FastifyError.statusCode and external error.status properties.
 * - Set appropriate HTTP status codes for different error types.
 */

import { FastifyError, FastifyInstance } from "fastify"
import fp from "fastify-plugin"

/**
 * Extended error interface to handle errors that may have a `status` property
 * instead of the standard FastifyError `statusCode` property.
 */
interface ErrorWithStatus extends FastifyError {
  status?: number
}

async function errorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler((err: ErrorWithStatus, request, reply) => {
    // Log the error with full context for debugging
    fastify.log.error(
      {
        err,
        request: {
          method: request.method,
          url: request.url,
          query: request.query,
          params: request.params,
        },
      },
      "Unhandled error occurred",
    )

    // Extract status code from either statusCode or status property
    const statusCode = err.statusCode ?? err.status ?? 500
    reply.code(statusCode)

    // Return consistent error response structure
    return {
      status: "error",
      statusCode,
      code: err.cause || err.code || "INTERNAL_ERROR",
      message: err.message || "Internal Server Error",
      ...(fastify.config.NODE_ENV === "development"
        ? { errorTrace: err.stack }
        : {}),
    }
  })
}

export default fp(errorHandler, { name: "error-handler" })
