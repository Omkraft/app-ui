export function getWeatherIcon(code: number): string {
	const map: Record<number, string> = {
		0: '☀️',
		1: '🌤️',
		2: '⛅',
		3: '☁️',
		45: '🌫️',
		48: '🌫️',
		51: '🌦️',
		61: '🌧️',
		71: '❄️',
		80: '🌦️',
		95: '⛈️',
	};

	return map[code] || '🌍';
}
