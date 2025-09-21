/**
 * Authentication utilities for the Otter server.
 *
 * Responsibilities:
 * - Build and configure a Better Auth instance via `createAuth` using Drizzle adapter.
 * - Wire database schema models and ULID-based ID generation.
 * - Configure auth features: base path, origins, email/password, API keys, bearer.
 *
 * - Export:
 *   - `createAuth(db?)`: primary factory to construct configured auth.
 */

import { account, apikey, session, user, verification } from "@otter/db/schema"
import { DatabaseInstance } from "@otter/db/types"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { apiKey, bearer } from "better-auth/plugins"
import { ulid } from "ulid"

/**
 * Creates a configured Better Auth instance with database adapter and plugins.
 * @param db - Optional database instance for auth data persistence
 * @param options - Configuration options for auth instance
 * @param options.origins - Comma-separated list of trusted origins for CORS
 * @param options.baseUrl - Base URL for auth callbacks and redirects
 * @param options.secret - Secret key for signing tokens and sessions
 * @returns Configured Better Auth instance with email/password and API key support
 */
export function createAuth(
  db?: DatabaseInstance,
  options?: { origins?: string; baseUrl?: string; secret?: string },
) {
  return betterAuth({
    trustedOrigins: options?.origins?.split(","),
    appName: "Otter",
    baseURL: options?.baseUrl,
    secret: options?.secret,
    database: drizzleAdapter(db!, {
      provider: "pg",
      schema: { account, apikey, session, user, verification },
    }),
    advanced: {
      database: {
        generateId: () => ulid(),
      },
      cookiePrefix: "otter",
      useSecureCookies: true,
    },
    basePath: "/api/v1/auth",
    emailAndPassword: {
      requireEmailVerification: false,
      enabled: true,
    },
    telemetry: { enabled: false },
    plugins: [
      apiKey({
        keyExpiration: {
          defaultExpiresIn: 60 * 60 * 24 * 30, // 30 days
        },
        rateLimit: {
          maxRequests: 100,
          timeWindow: 60 * 1000, // 1 minute
        },
        disableSessionForAPIKeys: true,
        defaultKeyLength: 128,
        requireName: true,
        defaultPrefix: "otter_pk_",
      }),
      bearer(),
    ],
  })
}

export const auth = createAuth()
