// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./index.html',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',

				primary: 'var(--primary)',
				'primary-foreground': 'var(--primary-foreground)',

				accent: 'var(--accent)',
				'accent-foreground': 'var(--accent-foreground)',

				border: 'var(--border)',
				input: 'var(--input)',
				ring: 'var(--ring)',
			},
		},
	},
	plugins: [],
};

export default config;
