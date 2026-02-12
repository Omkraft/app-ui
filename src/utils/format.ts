export function formatDate(dateString?: string) {
	if (!dateString) return '';

	const date = new Date(dateString);

	return date.toLocaleString('en-IN', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}
