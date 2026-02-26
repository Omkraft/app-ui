const LOGO_API_KEY = import.meta.env.VITE_LOGO_DEV_API_KEY as string;
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

const brandsInCategory: Record<string, { name: string; src: string; alt: string }[]> = {
	SIM_PREPAID: [
		{
			name: 'jio',
			src: `https://img.logo.dev/jio.com?token=${LOGO_API_KEY}&format=png`,
			alt: 'Jio logo',
		},
		{
			name: 'airtel',
			src: `https://img.logo.dev/airtel.com?token=${LOGO_API_KEY}&format=png`,
			alt: 'Airtel logo',
		},
		{
			name: 'vi',
			src: `https://img.logo.dev/vodafone.com?token=${LOGO_API_KEY}&format=png`,
			alt: 'Vodafone logo',
		},
		{
			name: 'vodafone',
			src: `https://img.logo.dev/vodafone.com?token=${LOGO_API_KEY}&format=png`,
			alt: 'Vodafone logo',
		},
		{
			name: 'bsnl',
			src: `https://img.logo.dev/bsnl.co.in?token=${LOGO_API_KEY}&format=png`,
			alt: 'BSNL logo',
		},
	],
	SIM_POSTPAID: [
		{
			name: 'jio',
			src: `https://img.logo.dev/jio.com?token=${LOGO_API_KEY}&format=png`,
			alt: 'Jio logo',
		},
		{
			name: 'airtel',
			src: `https://img.logo.dev/airtel.com?token=${LOGO_API_KEY}&format=png`,
			alt: 'Airtel logo',
		},
		{
			name: 'vi',
			src: `https://img.logo.dev/vodafone.com?token=${LOGO_API_KEY}&format=png`,
			alt: 'Vodafone logo',
		},
		{
			name: 'vodafone',
			src: `https://img.logo.dev/vodafone.com?token=${LOGO_API_KEY}&format=png`,
			alt: 'Vodafone logo',
		},
		{
			name: 'bsnl',
			src: `https://img.logo.dev/bsnl.co.in?token=${LOGO_API_KEY}&format=png`,
			alt: 'BSNL logo',
		},
	],
	OTT: [
		{
			name: 'netflix',
			src: `https://img.logo.dev/netflix.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Netflix logo',
		},
		{
			name: 'prime',
			src: `https://img.logo.dev/primevideo.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Prime Video logo',
		},
		{
			name: 'primevideo',
			src: `https://img.logo.dev/primevideo.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Prime Video logo',
		},
		{
			name: 'hotstar',
			src: `https://img.logo.dev/hotstar.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Hotstar logo',
		},
		{
			name: 'liv',
			src: `https://img.logo.dev/sonyliv.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Sony LIV logo',
		},
		{
			name: 'zee5',
			src: `https://img.logo.dev/zee5.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'ZEE5 logo',
		},
		{
			name: 'youtube',
			src: `https://img.logo.dev/youtube.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'YouTube logo',
		},
		{
			name: 'apple tv',
			src: `https://img.logo.dev/apple.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Apple TV logo',
		},
	],
	MUSIC: [
		{
			name: 'saavn',
			src: `https://img.logo.dev/jiosaavn.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'jio Saavn logo',
		},
		{
			name: 'jio saavn',
			src: `https://img.logo.dev/jiosaavn.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'jio Saavn logo',
		},
		{
			name: 'spotify',
			src: `https://img.logo.dev/spotify.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Spotify logo',
		},
		{
			name: 'gaana',
			src: `https://img.logo.dev/gaana.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Gaana.com logo',
		},
		{
			name: 'apple',
			src: `https://img.logo.dev/apple.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Apple logo',
		},
		{
			name: 'youtube',
			src: `https://img.logo.dev/youtube.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Google logo',
		},
		{
			name: 'google',
			src: `https://img.logo.dev/google.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Google logo',
		},
	],
	INTERNET: [
		{
			name: 'jio',
			src: `https://img.logo.dev/jio.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Jio Fiber logo',
		},
		{
			name: 'reliance',
			src: `https://img.logo.dev/jio.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Jio Fiber logo',
		},
		{
			name: 'airtel',
			src: `https://img.logo.dev/airtel.in?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Airtel Fiber logo',
		},
		{
			name: 'tata play',
			src: `https://img.logo.dev/tataplayfiber.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Tata Play Fiber logo',
		},
		{
			name: 'hathway',
			src: `https://img.logo.dev/hathway.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Hathway logo',
		},
		{
			name: 'bsnl',
			src: `https://img.logo.dev/bsnl.co.in?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'BSNL Fiber logo',
		},
	],
	DTH: [
		{
			name: 'tata play binge',
			src: `https://img.logo.dev/tataplaybinge.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Tata Play Binge logo',
		},
		{
			name: 'tata play',
			src: `https://img.logo.dev/tataplay.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Tata Play logo',
		},
		{
			name: 'airtel',
			src: `https://img.logo.dev/airtelxstream.in?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Airtel DTH logo',
		},
		{
			name: 'dish tv',
			src: `https://img.logo.dev/dishtv.in?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Dish TV logo',
		},
		{
			name: 'dishtv',
			src: `https://img.logo.dev/dishtv.in?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Dish TV logo',
		},
		{
			name: 'jio',
			src: `https://img.logo.dev/jio.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Jio logo',
		},
	],

	CLOUD: [
		{
			name: 'google cloud',
			src: `https://img.logo.dev/name/Google%20Cloud?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Google Cloud logo',
		},
		{
			name: 'google play',
			src: `https://img.logo.dev/google.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Google logo',
		},
		{
			name: 'aws',
			src: `https://img.logo.dev/amazonaws.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'AWS logo',
		},
		{
			name: 'dropbox',
			src: `https://img.logo.dev/dropbox.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Dropbox logo',
		},
		{
			name: 'icloud',
			src: `https://img.logo.dev/icloud.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'iCloud logo',
		},
		{
			name: 'microsoft',
			src: `https://img.logo.dev/microsoft.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Microsoft logo',
		},
		{
			name: 'onedrive',
			src: `https://img.logo.dev/onedrive.com.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Microsoft logo',
		},
		{
			name: 'one drive',
			src: `https://img.logo.dev/onedrive.com.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Microsoft logo',
		},
	],

	SOFTWARE: [
		{
			name: 'adobe',
			src: `https://img.logo.dev/adobe.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Adobe logo',
		},
		{
			name: 'microsoft',
			src: `https://img.logo.dev/microsoft.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Microsoft logo',
		},
		{
			name: 'figma',
			src: `https://img.logo.dev/figma.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Figma logo',
		},
		{
			name: 'chatgpt',
			src: `https://img.logo.dev/openai.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'OpenAI logo',
		},
		{
			name: 'office365',
			src: `https://img.logo.dev/office365.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Office 365 logo',
		},
		{
			name: 'office 365',
			src: `https://img.logo.dev/office365.com?token=${LOGO_API_KEY}&format=png&retina=true`,
			alt: 'Office 365 logo',
		},
		{
			name: 'google',
			src: `https://img.logo.dev/google.com?token=${LOGO_API_KEY}&format=png`,
			alt: 'Google One logo',
		},
		{
			name: 'apple',
			src: `https://img.logo.dev/apple.com?token=${LOGO_API_KEY}&format=png`,
			alt: 'Apple logo',
		},
	],

	GAMING: [
		{
			name: 'xbox',
			src: `https://img.logo.dev/xbox.com?token=${LOGO_API_KEY}&format=png`,
			alt: 'Xbox logo',
		},
		{
			name: 'playstation',
			src: `https://img.logo.dev/playstation.com?token=${LOGO_API_KEY}&format=png`,
			alt: 'PlayStation logo',
		},
		{
			name: 'steam',
			src: `https://img.logo.dev/steampowered.com?token=${LOGO_API_KEY}&format=png`,
			alt: 'Steam logo',
		},
		{
			name: 'epic',
			src: `https://img.logo.dev/epicgames.com?token=${LOGO_API_KEY}&format=png`,
			alt: 'Epic Games logo',
		},
		{
			name: 'rockstar',
			src: `https://img.logo.dev/rockstargames.com?token=${LOGO_API_KEY}&format=png`,
			alt: 'Rockstar Games logo',
		},
	],

	OTHER: [
		{
			name: 'google',
			src: `https://img.logo.dev/google.com?token=${LOGO_API_KEY}&format=png`,
			alt: 'Google One logo',
		},
		{
			name: 'apple',
			src: `https://img.logo.dev/apple.com?token=${LOGO_API_KEY}&format=png`,
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
	// STEP 1: Try category-specific brand match
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

	// STEP 2: fallback to category icon
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
