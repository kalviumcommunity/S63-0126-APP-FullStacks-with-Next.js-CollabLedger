import prettierConfig from "eslint-config-prettier";
import typescriptParser from "@typescript-eslint/parser";

export default [
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
];
