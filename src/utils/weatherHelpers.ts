import type { WeatherData } from '@/types/weather';

export function getNext5Hours(weather: WeatherData) {
	if (!weather?.hourly) return [];

	const now = new Date();

	const result = [];

	for (let i = 1; i < weather.hourly.time.length; i++) {
		const hourTime = new Date(weather.hourly.time[i]);

		if (hourTime > now) {
			result.push({
				time: hourTime,
				temperature: weather.hourly.temperature_2m[i],
				weather_code: weather.hourly.weather_code[i]
			});
		}

		if (result.length === 5) break;
	}

	return result;
}
