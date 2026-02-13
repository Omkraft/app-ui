export function getWeatherTheme(code?: number, isDay?: number) {
	if (!code) {
		return 'bg-gradient-to-br from-[var(--omkraft-navy-400)] to-[var(--omkraft-navy-600)]';
	}

	// Night mode override
	if (isDay === 0) {
		return 'bg-gradient-to-br from-[#021030] to-[#041459]';
	}

	// Clear sky
	if (code === 0) {
		return 'bg-gradient-to-br from-[var(--omkraft-primary)] to-[var(--omkraft-accent)]';
	}

	// Partly cloudy
	if ([1, 2, 3].includes(code)) {
		return 'bg-gradient-to-br from-[#2b3f88] to-[#305af3]';
	}

	// Rain
	if ([51, 53, 55, 61, 63, 65].includes(code)) {
		return 'bg-gradient-to-br from-[#1c2e6b] to-[#041459]';
	}

	// Thunderstorm
	if ([95, 96, 99].includes(code)) {
		return 'bg-gradient-to-br from-[#0f172a] to-[#1e293b]';
	}

	// Default fallback
	return 'bg-gradient-to-br from-[var(--omkraft-navy-400)] to-[var(--omkraft-navy-600)]';
}
