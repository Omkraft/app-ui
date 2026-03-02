import toi from '@/assets/media/toi.svg';
import ie from '@/assets/media/indian-express.svg';
import ht from '@/assets/media/hindustan-times.svg';
import bbc from '@/assets/media/bbc.svg';
import theHindu from '@/assets/media/the-hindu.svg';

import { cn } from '@/lib/utils';

interface Props {
	source: string;
	className?: string;
}

const logoMap: Record<string, string> = {
	'Times of India': toi,
	'Indian Express': ie,
	'Hindustan Times': ht,
	'BBC News': bbc,
	'The Hindu': theHindu,
};

export function NewsSourceLogo({ source, className }: Props) {
	const logo = logoMap[source];

	if (!logo) return null;

	return (
		<img
			src={logo}
			alt={source}
			className={cn('h-3 w-auto object-contain transition-all duration-200', className)}
		/>
	);
}
