import { Building2, Landmark, type LucideIcon } from 'lucide-react';
import { getCachedLogoUrl } from './logoProxy';

const investmentBrands: { name: string; src: string; alt: string }[] = [
	{
		name: 'Bajaj Finance',
		src: getCachedLogoUrl({ domain: 'bajajfinserv.in' }),
		alt: 'Bajaj Finance logo',
	},
	{
		name: 'Bajaj Finserv',
		src: getCachedLogoUrl({ domain: 'bajajfinserv.in' }),
		alt: 'Bajaj Finserv logo',
	},
	{
		name: 'state bank of india',
		src: getCachedLogoUrl({ domain: 'sbi.co.in' }),
		alt: 'State Bank of India logo',
	},
	{
		name: 'sbi',
		src: getCachedLogoUrl({ domain: 'sbi.co.in' }),
		alt: 'State Bank of India logo',
	},
	{
		name: 'hdfc',
		src: getCachedLogoUrl({ domain: 'hdfcbank.com' }),
		alt: 'HDFC Bank logo',
	},
	{
		name: 'icici',
		src: getCachedLogoUrl({ domain: 'icicibank.com' }),
		alt: 'ICICI Bank logo',
	},
	{
		name: 'axis',
		src: getCachedLogoUrl({ domain: 'axis.bank.in' }),
		alt: 'Axis Bank logo',
	},
	{
		name: 'mahindra finance',
		src: getCachedLogoUrl({ domain: 'mahindrafinance.com' }),
		alt: 'Mahindra Finance logo',
	},
	{
		name: 'Shriram Finance',
		src: getCachedLogoUrl({ domain: 'shriramfinance.in' }),
		alt: 'Shriram Finance logo',
	},
	{
		name: 'Canara Bank',
		src: getCachedLogoUrl({ domain: 'canarabank.bank.in' }),
		alt: 'Canara Bank logo',
	},
];

function getFallbackLogoUrl(institutionName: string) {
	return getCachedLogoUrl({ name: institutionName });
}

export function resolveInvestmentLogo(institutionName: string): {
	type: 'image' | 'icon';
	src?: string;
	alt?: string;
	Icon?: LucideIcon;
} {
	const normalizedName = institutionName.trim().toLowerCase();
	const match = investmentBrands.find((brand) =>
		normalizedName.includes(brand.name.toLowerCase())
	);

	if (match) {
		return {
			type: 'image',
			src: match.src,
			alt: match.alt,
		};
	}

	if (institutionName.trim()) {
		return {
			type: 'image',
			src: getFallbackLogoUrl(institutionName.trim()),
			alt: `${institutionName.trim()} logo`,
		};
	}

	return {
		type: 'icon',
		Icon: normalizedName.includes('finance') ? Landmark : Building2,
	};
}
