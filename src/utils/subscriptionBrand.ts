import {
	Gamepad2,
	Package,
	type LucideIcon,
	CardSim,
	TvMinimalPlay,
	SatelliteDish,
	Router,
	CloudUpload,
	Disc3,
	Music,
} from 'lucide-react';
import { getCachedLogoUrl } from './logoProxy';

const brandsInCategory: Record<string, { name: string; src: string; alt: string }[]> = {
	SIM_PREPAID: [
		{
			name: 'jio',
			src: getCachedLogoUrl({ domain: 'jio.com', retina: false }),
			alt: 'Jio logo',
		},
		{
			name: 'airtel',
			src: getCachedLogoUrl({ domain: 'airtel.com', retina: false }),
			alt: 'Airtel logo',
		},
		{
			name: 'vi',
			src: getCachedLogoUrl({ domain: 'vodafone.com', retina: false }),
			alt: 'Vodafone logo',
		},
		{
			name: 'vodafone',
			src: getCachedLogoUrl({ domain: 'vodafone.com', retina: false }),
			alt: 'Vodafone logo',
		},
		{
			name: 'bsnl',
			src: getCachedLogoUrl({ domain: 'bsnl.co.in', retina: false }),
			alt: 'BSNL logo',
		},
	],
	SIM_POSTPAID: [
		{
			name: 'jio',
			src: getCachedLogoUrl({ domain: 'jio.com', retina: false }),
			alt: 'Jio logo',
		},
		{
			name: 'airtel',
			src: getCachedLogoUrl({ domain: 'airtel.com', retina: false }),
			alt: 'Airtel logo',
		},
		{
			name: 'vi',
			src: getCachedLogoUrl({ domain: 'vodafone.com', retina: false }),
			alt: 'Vodafone logo',
		},
		{
			name: 'vodafone',
			src: getCachedLogoUrl({ domain: 'vodafone.com', retina: false }),
			alt: 'Vodafone logo',
		},
		{
			name: 'bsnl',
			src: getCachedLogoUrl({ domain: 'bsnl.co.in', retina: false }),
			alt: 'BSNL logo',
		},
	],
	OTT: [
		{ name: 'netflix', src: getCachedLogoUrl({ domain: 'netflix.com' }), alt: 'Netflix logo' },
		{
			name: 'prime',
			src: getCachedLogoUrl({ domain: 'primevideo.com' }),
			alt: 'Prime Video logo',
		},
		{
			name: 'primevideo',
			src: getCachedLogoUrl({ domain: 'primevideo.com' }),
			alt: 'Prime Video logo',
		},
		{ name: 'hotstar', src: getCachedLogoUrl({ domain: 'hotstar.com' }), alt: 'Hotstar logo' },
		{ name: 'liv', src: getCachedLogoUrl({ domain: 'sonyliv.com' }), alt: 'Sony LIV logo' },
		{ name: 'zee5', src: getCachedLogoUrl({ domain: 'zee5.com' }), alt: 'ZEE5 logo' },
		{ name: 'youtube', src: getCachedLogoUrl({ domain: 'youtube.com' }), alt: 'YouTube logo' },
		{ name: 'apple tv', src: getCachedLogoUrl({ domain: 'apple.com' }), alt: 'Apple TV logo' },
	],
	MUSIC: [
		{ name: 'saavn', src: getCachedLogoUrl({ domain: 'jiosaavn.com' }), alt: 'jio Saavn logo' },
		{
			name: 'jio saavn',
			src: getCachedLogoUrl({ domain: 'jiosaavn.com' }),
			alt: 'jio Saavn logo',
		},
		{ name: 'spotify', src: getCachedLogoUrl({ domain: 'spotify.com' }), alt: 'Spotify logo' },
		{ name: 'gaana', src: getCachedLogoUrl({ domain: 'gaana.com' }), alt: 'Gaana.com logo' },
		{ name: 'apple', src: getCachedLogoUrl({ domain: 'apple.com' }), alt: 'Apple logo' },
		{ name: 'youtube', src: getCachedLogoUrl({ domain: 'youtube.com' }), alt: 'Google logo' },
		{ name: 'google', src: getCachedLogoUrl({ domain: 'google.com' }), alt: 'Google logo' },
	],
	INTERNET: [
		{ name: 'jio', src: getCachedLogoUrl({ domain: 'jio.com' }), alt: 'Jio Fiber logo' },
		{ name: 'reliance', src: getCachedLogoUrl({ domain: 'jio.com' }), alt: 'Jio Fiber logo' },
		{
			name: 'airtel',
			src: getCachedLogoUrl({ domain: 'airtel.in' }),
			alt: 'Airtel Fiber logo',
		},
		{
			name: 'tata play',
			src: getCachedLogoUrl({ domain: 'tataplayfiber.com' }),
			alt: 'Tata Play Fiber logo',
		},
		{ name: 'hathway', src: getCachedLogoUrl({ domain: 'hathway.com' }), alt: 'Hathway logo' },
		{ name: 'bsnl', src: getCachedLogoUrl({ domain: 'bsnl.co.in' }), alt: 'BSNL Fiber logo' },
	],
	DTH: [
		{
			name: 'tata play binge',
			src: getCachedLogoUrl({ domain: 'tataplaybinge.com' }),
			alt: 'Tata Play Binge logo',
		},
		{
			name: 'tata play',
			src: getCachedLogoUrl({ domain: 'tataplay.com' }),
			alt: 'Tata Play logo',
		},
		{
			name: 'airtel',
			src: getCachedLogoUrl({ domain: 'airtelxstream.in' }),
			alt: 'Airtel DTH logo',
		},
		{ name: 'dish tv', src: getCachedLogoUrl({ domain: 'dishtv.in' }), alt: 'Dish TV logo' },
		{ name: 'dishtv', src: getCachedLogoUrl({ domain: 'dishtv.in' }), alt: 'Dish TV logo' },
		{ name: 'jio', src: getCachedLogoUrl({ domain: 'jio.com' }), alt: 'Jio logo' },
	],
	CLOUD: [
		{
			name: 'google cloud',
			src: getCachedLogoUrl({ name: 'Google Cloud' }),
			alt: 'Google Cloud logo',
		},
		{
			name: 'google play',
			src: getCachedLogoUrl({ domain: 'google.com' }),
			alt: 'Google logo',
		},
		{ name: 'aws', src: getCachedLogoUrl({ domain: 'amazonaws.com' }), alt: 'AWS logo' },
		{ name: 'dropbox', src: getCachedLogoUrl({ domain: 'dropbox.com' }), alt: 'Dropbox logo' },
		{ name: 'icloud', src: getCachedLogoUrl({ domain: 'icloud.com' }), alt: 'iCloud logo' },
		{
			name: 'microsoft',
			src: getCachedLogoUrl({ domain: 'microsoft.com' }),
			alt: 'Microsoft logo',
		},
		{
			name: 'onedrive',
			src: getCachedLogoUrl({ domain: 'onedrive.com.com' }),
			alt: 'Microsoft logo',
		},
		{
			name: 'one drive',
			src: getCachedLogoUrl({ domain: 'onedrive.com.com' }),
			alt: 'Microsoft logo',
		},
	],
	SOFTWARE: [
		{ name: 'adobe', src: getCachedLogoUrl({ domain: 'adobe.com' }), alt: 'Adobe logo' },
		{
			name: 'microsoft',
			src: getCachedLogoUrl({ domain: 'microsoft.com' }),
			alt: 'Microsoft logo',
		},
		{ name: 'figma', src: getCachedLogoUrl({ domain: 'figma.com' }), alt: 'Figma logo' },
		{ name: 'chatgpt', src: getCachedLogoUrl({ domain: 'openai.com' }), alt: 'OpenAI logo' },
		{
			name: 'office365',
			src: getCachedLogoUrl({ domain: 'office365.com' }),
			alt: 'Office 365 logo',
		},
		{
			name: 'office 365',
			src: getCachedLogoUrl({ domain: 'office365.com' }),
			alt: 'Office 365 logo',
		},
		{
			name: 'google',
			src: getCachedLogoUrl({ domain: 'google.com', retina: false }),
			alt: 'Google One logo',
		},
		{
			name: 'apple',
			src: getCachedLogoUrl({ domain: 'apple.com', retina: false }),
			alt: 'Apple logo',
		},
	],
	GAMING: [
		{
			name: 'xbox',
			src: getCachedLogoUrl({ domain: 'xbox.com', retina: false }),
			alt: 'Xbox logo',
		},
		{
			name: 'playstation',
			src: getCachedLogoUrl({ domain: 'playstation.com', retina: false }),
			alt: 'PlayStation logo',
		},
		{
			name: 'steam',
			src: getCachedLogoUrl({ domain: 'steampowered.com', retina: false }),
			alt: 'Steam logo',
		},
		{
			name: 'epic',
			src: getCachedLogoUrl({ domain: 'epicgames.com', retina: false }),
			alt: 'Epic Games logo',
		},
		{
			name: 'rockstar',
			src: getCachedLogoUrl({ domain: 'rockstargames.com', retina: false }),
			alt: 'Rockstar Games logo',
		},
	],
	OTHER: [
		{
			name: 'google',
			src: getCachedLogoUrl({ domain: 'google.com', retina: false }),
			alt: 'Google One logo',
		},
		{
			name: 'apple',
			src: getCachedLogoUrl({ domain: 'apple.com', retina: false }),
			alt: 'Apple logo',
		},
	],
};

export function resolveLogo(
	category: string,
	provider?: string
): {
	type: 'image' | 'icon';
	src?: string;
	alt?: string;
	Icon?: LucideIcon;
} {
	if (provider && category in brandsInCategory) {
		const brands = brandsInCategory[category];
		const match = brands.find((brand) =>
			provider.toLowerCase().includes(brand.name.toLowerCase())
		);

		if (match) {
			return {
				type: 'image',
				src: match.src,
				alt: match.alt,
			};
		}
	}

	return {
		type: 'icon',
		Icon: getCategoryIcon(category),
	};
}

function getCategoryIcon(category: string): LucideIcon {
	switch (category) {
		case 'SIM_PREPAID':
		case 'SIM_POSTPAID':
			return CardSim;
		case 'OTT':
			return TvMinimalPlay;
		case 'DTH':
			return SatelliteDish;
		case 'MUSIC':
			return Music;
		case 'INTERNET':
			return Router;
		case 'CLOUD':
			return CloudUpload;
		case 'GAMING':
			return Gamepad2;
		case 'SOFTWARE':
			return Disc3;
		default:
			return Package;
	}
}
