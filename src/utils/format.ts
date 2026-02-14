export function formatDate(dateString?: string) {
	if (!dateString) return '';

	const date = new Date(dateString);

	return new Intl.DateTimeFormat('en-IN', {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(date);
}

export function round(value: string | number, decimals = 1) {
	if (typeof value !== 'number') return value;
	return Number(value.toFixed(decimals));
}

export function formatTimeLocal (time: string) {
	const [hour, minute] = time.split('T')[1].slice(0, 5).split(':');
		
	const date = new Date();
	date.setHours(Number(hour));
	date.setMinutes(Number(minute));

	return date.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	});
};