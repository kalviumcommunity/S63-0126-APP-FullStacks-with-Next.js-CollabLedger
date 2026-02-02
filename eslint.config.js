import nextPlugin from '@eslint-plugin-next';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: ['.next', 'node_modules', 'dist', 'build'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      next: nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
    },
  },
];
