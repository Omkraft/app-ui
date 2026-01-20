const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const tseslint = require('typescript-eslint');

module.exports = [
	{
		ignores: [
			'eslint.config.cjs',
			'vite.config.ts',
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
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			/* formatting */
			indent: ['error', 'tab'],
			quotes: ['error', 'single'],
			semi: ['error', 'always'],

			/* React */
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',

			/* Hooks */
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',

			/* TS */
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],

			/* Allow CommonJS in config files */
			'@typescript-eslint/no-require-imports': 'off',
		},
	},
];
