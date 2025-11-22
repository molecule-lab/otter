/**
 * Vitest configuration for the utils package.
 *
 * Responsibilities:
 * - Extend base Vitest configuration with package-specific settings
 * - Configure path aliases for clean imports
 * - Set test environment to Node.js for server-side testing
 *
 * Exports:
 * - Default Vitest configuration merged with base config
 */

import path from "path"
import { fileURLToPath } from "url"
import base from "@otter/vitest-config/base"
import { mergeConfig } from "vitest/config"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default mergeConfig(base, {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
  },
})
