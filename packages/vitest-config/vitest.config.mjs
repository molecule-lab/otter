/**
 * Base Vitest configuration shared across all packages.
 *
 * Responsibilities:
 * - Define common test patterns and file matching rules
 * - Configure code coverage settings and exclusions
 * - Set up coverage reporting formats for CI/CD integration
 * - Provide consistent testing configuration across monorepo packages
 *
 * Exports:
 * - Default Vitest configuration with test discovery and coverage settings
 */

import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    reporters: ["dot"],
    coverage: {
      provider: "v8",
      include: ["src/**"],
      exclude: [
        "src/**/index.*",
        "src/**/__test__/**",
        "src/**/*.test.*",
        "src/**/*.spec.*",
      ],
      reporter: ["text", "text-summary", "lcov", "html"],
    },
  },
})
