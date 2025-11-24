/**
 * Fastify server bootstrap for the Otter service.
 *
 * Responsibilities:
 * - Configure logger and AJV validation options.
 * - Register the application plugin `serviceApp`.
 * - Install graceful shutdown via `close-with-grace`.
 * - Start the HTTP server on port provided in config and handle startup errors.
 *
 * Entry point:
 * - Calls `init()` to initialize and launch the server.
 */

import serviceApp from "@/app"
import closeWithGrace from "close-with-grace"
import Fastify from "fastify"
import fp from "fastify-plugin"

/**
 * Configures logger based on environment (interactive vs production).
 * @returns Logger configuration object with appropriate settings
 */
function getLoggerOptions() {
  // Use pretty logging only in interactive terminals for development
  if (process.stdout.isTTY) {
    return {
      level: "info",
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    }
  }
  // Info logging for production environments
  return { level: "info" }
}

const app = Fastify({
  logger: getLoggerOptions(),
  ajv: {
    customOptions: {
      coerceTypes: "array",
      removeAdditional: "all",
    },
  },
})

/**
 * Initializes and starts the Fastify server with graceful shutdown handling.
 * @returns Promise that resolves when server is ready and listening
 */
async function init() {
  app.register(fp(serviceApp))

  // Handle graceful shutdown with 500ms delay for ongoing requests
  closeWithGrace({ delay: 500 }, async ({ err }) => {
    if (err != null) {
      app.log.error(err)
    }

    await app.close()
  })

  await app.ready()

  try {
    // Start HTTP server on configured port
    await app.listen({ port: app.config.PORT })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

init()
