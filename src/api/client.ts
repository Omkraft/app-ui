const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/**
 * Refresh access token using httpOnly refresh cookie
 */
async function refreshAccessToken(): Promise<string> {
	const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
		method: 'POST',
		credentials: 'include', // IMPORTANT: send refresh cookie
	});

	if (!response.ok) {
		throw new Error('Session expired');
	}

	const data = await response.json();
	localStorage.setItem('token', data.token);
	return data.token;
}

/**
 * Central API request helper
 */
export async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const token = localStorage.getItem('token');

	const headers: HeadersInit = {
		'Content-Type': 'application/json',
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...(options.headers || {}),
	};

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers,
		credentials: 'include', // allow refresh cookie
	});

	// If token expired, try refresh ONCE
	if (response.status === 401) {
		try {
			const newToken = await refreshAccessToken();

			const retryHeaders: HeadersInit = {
				...headers,
				Authorization: `Bearer ${newToken}`,
			};

			const retryResponse = await fetch(
				`${API_BASE_URL}${endpoint}`,
				{
					...options,
					headers: retryHeaders,
					credentials: 'include',
				}
			);

			if (!retryResponse.ok) {
				const error = await retryResponse.json();
				throw new Error(error.message || 'API error');
			}

			return retryResponse.json();
		} catch {
			// Refresh failed → logout hard
			localStorage.removeItem('token');
			throw new Error('Session expired. Please login again.');
		}
	}

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'API error');
	}

	return response.json();
}
