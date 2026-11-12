// ESLint is enabled for ps2.
// Run with: npm run lint
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['dist/**', 'coverage/**', 'node_modules/**', 'eslint.config.js'] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            // warnings, not errors, so stubs still compile while you work
            '@typescript-eslint/no-unused-vars': 'warn',
            'prefer-const': 'warn',
            'eqeqeq': 'warn',
        },
    },
);
