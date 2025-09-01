import path from "path";
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, ".env") });

export default defineConfig({
  out: "./drizzle",
  schema: "../../packages/db/src/schema/users.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_CONNECTION_URL!,
  },
});
