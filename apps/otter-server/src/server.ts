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

import serviceApp from "@/src/app"
import closeWithGrace from "close-with-grace"
import Fastify from "fastify"
import fp from "fastify-plugin"

function getLoggerOptions() {
  // Only if the program is running in an interactive terminal
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

  return { level: "silent" }
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

async function init() {
  app.register(fp(serviceApp))

  closeWithGrace({ delay: 500 }, async ({ err }) => {
    if (err != null) {
      app.log.error(err)
    }

    await app.close()
  })

  await app.ready()

  try {
    // Start listening.
    await app.listen({ port: app.config.PORT })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

init()
