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

import { DatabaseInstance } from "@otter/db"
import { account, apikey, session, user, verification } from "@otter/db/schema"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { apiKey, bearer } from "better-auth/plugins"
import { ulid } from "ulid"

// Todo make this accept trusted origins, baseurl and secret
export function createAuth(db?: DatabaseInstance) {
  return betterAuth({
    trustedOrigins: ["http://localhost:3001"],
    appName: "Otter",
    baseURL: "http://localhost:3001",
    database: drizzleAdapter(db!, {
      provider: "pg",
      schema: { account, apikey, session, user, verification },
    }),
    advanced: {
      database: {
        generateId: () => ulid(),
      },
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
