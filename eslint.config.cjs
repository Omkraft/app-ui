const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const tseslint = require('typescript-eslint');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
	{
		ignores: [
			'eslint.config.cjs',
			'vite.config.ts',
			'dev-dist/**',
			'dist/**',
			'node_modules/**',
		],
	},

	js.configs.recommended,
	...tseslint.configs.recommended,

	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			react,
			'react-hooks': reactHooks,
			prettier: prettierPlugin,
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			// Formatting (Tabs)
			'prettier/prettier': [
				'error',
				{
					useTabs: true,
					tabWidth: 4,
					singleQuote: true,
					semi: true,
					trailingComma: 'es5',
					printWidth: 100,
					endOfLine: 'auto',
				},
			],

			// Disable conflicting rules
			indent: 'off',
			'no-tabs': 'off',

			// Code quality
			quotes: ['error', 'single'],
			semi: ['error', 'always'],
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
		},
	},

	prettierConfig,
];
