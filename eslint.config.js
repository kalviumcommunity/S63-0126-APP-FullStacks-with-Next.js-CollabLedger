import js from "@eslint/js";
import nextConfig from "eslint-config-next";
import prettierConfig from "eslint-config-prettier";
import typescriptParser from "@typescript-eslint/parser";

const config = [
  js.configs.recommended,
  ...nextConfig,
  {
    ignores: [".next", "node_modules", "dist", "build"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...prettierConfig.rules,
    },
  },
  prettierConfig,
];

export default config;
