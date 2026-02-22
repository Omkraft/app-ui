export function getWeatherTheme(code?: number, isDay?: number) {
	// Default fallback (brand navy depth)
	const defaultTheme = 'bg-background';

	if (code === undefined || code === null) {
		return defaultTheme;
	}

	// 🌙 Night override (deeper navy)
	if (isDay === 0) {
		return 'bg-gradient-to-br from-[var(--omkraft-navy-700)] to-[var(--omkraft-navy-900)]';
	}

	// ☀️ Clear sky (Primary → Accent)
	if (code === 0) {
		return 'bg-gradient-to-br from-[var(--omkraft-blue-400)] to-[var(--omkraft-mint-600)]';
	}

	// 🌤️ Partly cloudy
	if ([1, 2, 3].includes(code)) {
		return 'bg-gradient-to-br from-[var(--omkraft-blue-500)] to-[var(--omkraft-navy-400)]';
	}

	// 🌧️ Rain
	if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
		return 'bg-gradient-to-br from-[var(--omkraft-navy-400)] to-[var(--omkraft-blue-700)]';
	}

	// ❄️ Snow
	if ([71, 73, 75, 85, 86].includes(code)) {
		return 'bg-gradient-to-br from-[var(--omkraft-blue-200)] to-[var(--omkraft-navy-300)]';
	}

	// ⛈️ Thunderstorm
	if ([95, 96, 99].includes(code)) {
		return 'bg-gradient-to-br from-[var(--omkraft-navy-600)] to-[var(--omkraft-blue-800)]';
	}

	// 🌫️ Fog / Mist
	if ([45, 48].includes(code)) {
		return 'bg-gradient-to-br from-[var(--omkraft-navy-300)] to-[var(--omkraft-navy-500)]';
	}

	return defaultTheme;
}
