import type { ReactNode, SVGProps } from 'react';
import {
	MoonStar,
	ZodiacAquarius,
	ZodiacAries,
	ZodiacCancer,
	ZodiacCapricorn,
	ZodiacGemini,
	ZodiacLeo,
	ZodiacLibra,
	ZodiacPisces,
	ZodiacSagittarius,
	ZodiacScorpio,
	ZodiacTaurus,
	ZodiacVirgo,
} from 'lucide-react';

type IconProps = SVGProps<SVGSVGElement>;
export const PANCHANG_CARD_ICON_CLASS = 'h-8 w-8 scale-[1.5]';
export const PANCHANG_ZODIAC_ICON_CLASS = 'h-8 w-8 scale-[0.875]';

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

const MOON_RASHI_ICONS = {
	Mesha: ZodiacAries,
	Vrishabha: ZodiacTaurus,
	Mithuna: ZodiacGemini,
	Karka: ZodiacCancer,
	Simha: ZodiacLeo,
	Kanya: ZodiacVirgo,
	Tula: ZodiacLibra,
	Vrischika: ZodiacScorpio,
	Dhanu: ZodiacSagittarius,
	Makara: ZodiacCapricorn,
	Kumbha: ZodiacAquarius,
	Meena: ZodiacPisces,
} as const;

export function MoonRashiIcon({
	rashi,
	className = PANCHANG_ZODIAC_ICON_CLASS,
	...props
}: IconProps & {
	rashi: string;
}) {
	const Icon = MOON_RASHI_ICONS[rashi as keyof typeof MOON_RASHI_ICONS];

	if (!Icon) {
		return <MoonStar className={className} {...props} />;
	}

	return <Icon className={className} strokeWidth={1.8} {...props} />;
}
