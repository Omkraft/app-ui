const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export class ApiError extends Error {
	status?: number;
	details?: unknown;

	constructor(message: string, status?: number, details?: unknown) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.details = details;
	}
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	const token = localStorage.getItem('token');
	const hadToken = Boolean(token);

	const headers: HeadersInit = {
		'Content-Type': 'application/json',
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...(options.headers || {}),
	};

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers,
	});

	if (response.status === 401) {
		localStorage.removeItem('token');
		localStorage.removeItem('auth');
		if (hadToken) {
			throw new ApiError('Session expired. Please login again.', 401);
		}
	}

	if (!response.ok) {
		let payload: unknown = null;

		try {
			payload = await response.json();
		} catch {
			payload = null;
		}

		const message =
			typeof payload === 'object' &&
			payload !== null &&
			'message' in payload &&
			typeof (payload as { message?: unknown }).message === 'string'
				? ((payload as { message: string }).message ?? 'API error')
				: 'API error';

		throw new ApiError(message, response.status, payload);
	}

	return response.json();
}
