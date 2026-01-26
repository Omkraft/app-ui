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

			fontSize: {
				h1: ['2rem', { lineHeight: '1.25', fontWeight: '600' }],
				h2: ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
				h3: ['1.25rem', { lineHeight: '1.35', fontWeight: '600' }],
				h4: ['1rem', { lineHeight: '1.4', fontWeight: '600' }],
				body: ['0.875rem', { lineHeight: '1.6' }],
				'body-sm': ['0.8125rem', { lineHeight: '1.5' }],
				caption: ['0.75rem', { lineHeight: '1.4' }],
				button: ['0.8125rem', { lineHeight: '1.2', fontWeight: '500' }],
			},

			letterSpacing: {
				button: '0.01em',
			},
		},
	},
	plugins: [],
};

export default config;
