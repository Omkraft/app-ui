// Vibrant, distinguishable colors (mix of Omkraft + Tailwind palette)

export const CATEGORY_COLORS: Record<string, string> = {
	OTT: '#ef4444', // red-500
	MUSIC: '#22c55e', // green-500
	SIM_PREPAID: '#3b82f6', // blue-500
	SIM_POSTPAID: '#6366f1', // indigo-500
	INTERNET: '#f59e0b', // amber-500
	DTH: '#ec4899', // pink-500
	SOFTWARE: '#14b8a6', // teal-500
	CLOUD: '#8b5cf6', // violet-500
	GAMING: '#f97316', // orange-500
	OTHER: '#64748b', // slate-500
};

// fallback rotating palette (for safety)
export const FALLBACK_COLORS = [
	'#ef4444', // red
	'#22c55e', // green
	'#3b82f6', // blue
	'#f59e0b', // amber
	'#ec4899', // pink
	'#8b5cf6', // violet
	'#14b8a6', // teal
	'#f97316', // orange
	'#06b6d4', // cyan
	'#84cc16', // lime
];
