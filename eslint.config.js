import js from "@eslint/js";
import nextConfig from "eslint-config-next";
import prettierConfig from "eslint-config-prettier";

const config = [
  js.configs.recommended,
  ...nextConfig,
  {
    ignores: [".next", "node_modules", "dist", "build"],
  },
  prettierConfig,
];

export default config;
