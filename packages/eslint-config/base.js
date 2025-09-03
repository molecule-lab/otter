import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import noRelativePathPlugin from "eslint-plugin-no-relative-import-paths"
import turboPlugin from "eslint-plugin-turbo"
import unusedImportsPlugin from "eslint-plugin-unused-imports"
import tseslint from "typescript-eslint"

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
      "no-relative-import-paths": noRelativePathPlugin,
      "unused-imports": unusedImportsPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
      "@typescript-eslint/no-unused-vars": ["error"],
      "no-relative-import-paths/no-relative-import-paths": [
        "error",
        { allowSameFolder: false, rootDir: "." },
      ],
      "unused-imports/no-unused-imports": "error",
    },
  },
  {
    ignores: ["dist/**"],
  },
]
