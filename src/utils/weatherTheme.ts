export function getWeatherTheme(code?: number, isDay?: number) {
	const baseTheme = 'weather-surface weather-surface--default';

	if (code === undefined || code === null) {
		return baseTheme;
	}

	if (isDay === 0) {
		return 'weather-surface weather-surface--night';
	}

	if (code === 0) {
		return 'weather-surface weather-surface--clear';
	}

	if ([1, 2, 3].includes(code)) {
		return 'weather-surface weather-surface--cloudy';
	}

	if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
		return 'weather-surface weather-surface--rain';
	}

	if ([71, 73, 75, 85, 86].includes(code)) {
		return 'weather-surface weather-surface--snow';
	}

	if ([95, 96, 99].includes(code)) {
		return 'weather-surface weather-surface--storm';
	}

	if ([45, 48].includes(code)) {
		return 'weather-surface weather-surface--fog';
	}

	return baseTheme;
}
