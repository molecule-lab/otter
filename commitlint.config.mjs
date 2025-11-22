export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
        "lint",
      ],
    ],
    "scope-enum": [
      2,
      "always",
      [
        "otter-server",
        "api",
        "core",
        "db",
        "eslint-config",
        "root",
        "utils",
        "vitest-config",
      ],
    ],
    "scope-empty": [2, "never"],
  },
}
