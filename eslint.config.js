import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  // TODO is not overriding below rules
  // tseslint.configs.recommended, 
  // https://eslint.org/docs/latest/use/configure/configuration-files#configuration-objects
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['doc/**/*', 'node_modules/**/*', 'dist/**/*', 'build/**/*'],
    rules: {
      // https://typescript-eslint.io/rules/no-unused-vars/
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    }
  },
);