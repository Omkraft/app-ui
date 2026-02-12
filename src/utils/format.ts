export function formatDate(dateString?: string) {
	if (!dateString) return '';

	const date = new Date(dateString);

	return new Intl.DateTimeFormat('en-IN', {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(date);
}
