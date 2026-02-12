import toi from '@/assets/media/toi.svg';
import ie from '@/assets/media/indian-express.svg';
import th from '@/assets/media/the-hindu.svg';
import bbc from '@/assets/media/bbc.svg';
import nyt from '@/assets/media/nyt.svg';

interface Props {
  source: string;
}

const logoMap: Record<string, string> = {
	'Times of India': toi,
	'Indian Express': ie,
	'The Hindu': th,
	'BBC News': bbc,
	'New York Times': nyt,
};

export function NewsSourceLogo({ source }: Props) {
	const logo = logoMap[source];

	if (!logo) return null;

	return (
		<img
			src={logo}
			alt={source}
			className="h-3 w-auto object-contain transition-all duration-200"
		/>
	);
}
