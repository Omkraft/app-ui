import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: ['class'],
	content: [
		'./index.html',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				/* Core surfaces */
				background: 'var(--background)',
				foreground: 'var(--foreground)',

				/* Brand */
				primary: 'var(--primary)',
				'primary-foreground': 'var(--primary-foreground)',

				secondary: 'var(--secondary)',
				'secondary-foreground': 'var(--secondary-foreground)',

				accent: 'var(--accent)',
				'accent-foreground': 'var(--accent-foreground)',

				/* UI states */
				muted: 'var(--muted)',
				'muted-foreground': 'var(--muted-foreground)',

				destructive: 'var(--destructive)',
				'destructive-foreground': 'var(--destructive-foreground)',

				/* Borders & focus */
				border: 'var(--border)',
				input: 'var(--input)',
				ring: 'var(--ring)',
			},

			borderRadius: {
				sm: 'var(--radius-sm)',
				md: 'var(--radius-md)',
				lg: 'var(--radius-lg)',
			},

			fontFamily: {
				sans: ['var(--font-sans)'],
			},
		},
	},
	plugins: [],
};

export default config;
