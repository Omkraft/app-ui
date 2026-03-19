import type { ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function IconFrame({ children, ...props }: IconProps & { children: ReactNode }) {
	return (
		<svg
			viewBox="0 0 48 48"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			{children}
		</svg>
	);
}

export function TithiIcon(props: IconProps) {
	return (
		<IconFrame {...props}>
			<path d="M18 16a10 10 0 1 0 0 16a8 8 0 1 1 0-16Z" />
			<path d="M28 16h7" />
			<path d="M28 24h9" />
			<path d="M28 32h7" />
		</IconFrame>
	);
}

export function NakshatraIcon(props: IconProps) {
	return (
		<IconFrame {...props}>
			<path d="m24 13 2.8 6.6 7.2.6-5.5 4.7 1.7 7-6.2-3.9-6.2 3.9 1.7-7-5.5-4.7 7.2-.6L24 13Z" />
			<circle cx="34" cy="14" r="1.5" />
		</IconFrame>
	);
}

export function YogaIcon(props: IconProps) {
	return (
		<IconFrame {...props}>
			<circle cx="18" cy="20" r="4.5" />
			<circle cx="30" cy="20" r="4.5" />
			<path d="M18 24.5v5.5" />
			<path d="M30 24.5v5.5" />
			<path d="M18 30h12" />
			<path d="M24 30v4" />
		</IconFrame>
	);
}

export function KaranaIcon(props: IconProps) {
	return (
		<IconFrame {...props}>
			<path d="M16 18h16" />
			<path d="M16 24h16" />
			<path d="M16 30h10" />
			<path d="M31 30h1" />
			<path d="M16 14h1" />
			<path d="M20 14h1" />
			<path d="M24 14h1" />
		</IconFrame>
	);
}

const RASHI_SYMBOLS: Record<string, string> = {
	Mesha: '\u2648',
	Vrishabha: '\u2649',
	Mithuna: '\u264A',
	Karka: '\u264B',
	Simha: '\u264C',
	Kanya: '\u264D',
	Tula: '\u264E',
	Vrischika: '\u264F',
	Dhanu: '\u2650',
	Makara: '\u2651',
	Kumbha: '\u2652',
	Meena: '\u2653',
};

export function RashiIcon({
	rashi,
	...props
}: IconProps & {
	rashi: string;
}) {
	const symbol = RASHI_SYMBOLS[rashi] ?? '\u25CC';

	return (
		<svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
			<text
				x="24"
				y="24"
				textAnchor="middle"
				dominantBaseline="middle"
				fontSize="30"
				fontWeight="700"
				fill="currentColor"
			>
				{symbol}
			</text>
		</svg>
	);
}
