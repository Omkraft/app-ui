import toi from '@/assets/media/toi.svg';
import ie from '@/assets/media/indian-express.svg';
import ht from '@/assets/media/hindustan-times.svg';
import bbc from '@/assets/media/bbc.svg';
import nyt from '@/assets/media/nyt.svg';

interface Props {
  source: string;
}

const logoMap: Record<string, string> = {
	'Times of India': toi,
	'Indian Express': ie,
	'Hindustan Times': ht,
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
