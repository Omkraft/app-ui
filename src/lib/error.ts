export function toDisplayError(error: unknown, fallbackMessage: string) {
	return error instanceof Error ? error : fallbackMessage;
}

export function reportUiError(context: string, error: unknown, details?: Record<string, unknown>) {
	const payload = details ? { error, ...details } : error;
	console.error(`[${context}]`, payload);
}
