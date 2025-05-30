// /** @type {import("eslint").Linter.Config} */
const config = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: true,
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'next/core-web-vitals',
        // 'plugin:@typescript-eslint/recommended-type-checked',
        // 'plugin:@typescript-eslint/stylistic-type-checked',
    ],
    rules: {
        // '@typescript-eslint/no-unsafe-call': 'warn',
        // '@typescript-eslint/no-unsafe-assignment': 'warn',
        // '@typescript-eslint/no-unsafe-member-access': 'warn',
        // '@typescript-eslint/array-type': 'off',
        // '@typescript-eslint/consistent-type-definitions': 'off',
        // '@typescript-eslint/no-unused-expressions': 'off',
        // '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/consistent-type-imports': [
            'warn',
            {
                prefer: 'type-imports',
                fixStyle: 'inline-type-imports',
            },
        ],
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
            },
        ],
        '@typescript-eslint/no-misused-promises': [
            'error',
            {
                checksVoidReturn: {
                    attributes: false,
                },
            },
        ],
    },
    ignorePatterns: ['.fttemplates'],
}

module.exports = config
