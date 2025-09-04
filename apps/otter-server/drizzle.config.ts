import path from "path"
import * as dotenv from "dotenv"
import { defineConfig } from "drizzle-kit"

dotenv.config({ path: path.join(__dirname, ".env") })

export default defineConfig({
  out: "./drizzle",
  schema: ["../../packages/db/src/schema/better-auth.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_CONNECTION_URL!,
  },
})
