/**
 * Environment configuration plugin for the Otter server.
 *
 * Responsibilities:
 * - Validate and provide access to environment variables.
 * - Configure database connection, AI provider settings, server port, and rate limiting.
 * - Configure authentication settings (origins, base URL, secret) for Better Auth.
 * - Ensure required environment variables are present at startup.
 * - Provide type-safe configuration access through Fastify instance.
 * - Support configurable rate limiting via MAX_REQUEST_PER_MINUTE environment variable.
 *
 * @see {@link https://github.com/fastify/fastify-env}
 */

import env from "@fastify/env"

/**
 * Fastify instance configuration interface.
 * Extends FastifyInstance to include typed configuration properties.
 */
declare module "fastify" {
  export interface FastifyInstance {
    config: {
      PORT: number
      DB_CONNECTION_URL: string
      AI_PROVIDER: "openai"
      AI_PROVIDER_API_KEY: string
      MAX_REQUEST_PER_MINUTE: number
      ORIGINS: string
      BASE_URL: string
      AUTH_SECRET: string
    }
  }
}

/**
 * Environment variable validation schema.
 * Defines required and optional environment variables with their types and constraints.
 *
 * Configuration includes:
 * - Server settings (PORT)
 * - Database connection (DB_CONNECTION_URL)
 * - AI provider configuration (AI_PROVIDER, AI_PROVIDER_API_KEY)
 * - Rate limiting configuration (MAX_REQUEST_PER_MINUTE)
 * - Authentication configuration (ORIGINS, BASE_URL, AUTH_SECRET)
 */
const schema = {
  type: "object",
  required: [
    "DB_CONNECTION_URL",
    "AI_PROVIDER",
    "AI_PROVIDER_API_KEY",
    "ORIGINS",
    "BASE_URL",
    "AUTH_SECRET",
  ],
  properties: {
    PORT: {
      type: "number",
      default: 3000,
    },
    DB_CONNECTION_URL: {
      type: "string",
    },
    AI_PROVIDER: {
      type: "string",
      enum: ["openai"],
    },
    AI_PROVIDER_API_KEY: {
      type: "string",
    },
    MAX_REQUEST_PER_MINUTE: {
      type: "number",
      default: 100,
      description:
        "Maximum number of requests allowed per minute for rate limiting",
    },
    ORIGINS: {
      type: "string",
    },
    BASE_URL: {
      type: "string",
    },
    AUTH_SECRET: {
      type: "string",
    },
  },
}

/**
 * Fastify environment plugin configuration.
 * Configures environment variable loading, validation, and Fastify instance decoration.
 */
export const autoConfig = {
  // Decorate Fastify instance with `config` key
  // Optional, default: 'config'
  confKey: "config",

  // Schema to validate
  schema,

  // Needed to read .env in root folder
  dotenv: true,
  // or, pass config options available on dotenv module
  // dotenv: {
  //   path: `${import.meta.dirname}/.env`,
  //   debug: true
  // }

  // Source for the configuration data
  // Optional, default: process.env
  data: process.env,
}

export default env
