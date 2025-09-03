import { DatabaseInstance } from "@otter/db"
import { account, apikey, session, user, verification } from "@otter/db/schema"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { apiKey, bearer } from "better-auth/plugins"

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
    emailAndPassword: {
      requireEmailVerification: false,
      enabled: true,
    },
    plugins: [
      apiKey({
        keyExpiration: {
          defaultExpiresIn: null,
          disableCustomExpiresTime: true,
        },
      }),
      bearer(),
    ],
  })
}

export const auth = createAuth()
