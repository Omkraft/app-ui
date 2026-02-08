const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

async function refreshAccessToken(): Promise<string> {
	const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
		method: 'POST',
		credentials: 'include',
	});

	if (!response.ok) {
		throw new Error('Session expired');
	}

	const data = await response.json();
	localStorage.setItem('token', data.token);
	return data.token;
}

export async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {},
	config?: { skipAuthRefresh?: boolean }
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
		credentials: 'include',
	});

	// 🔒 ONLY retry refresh for protected APIs
	if (response.status === 401 && !config?.skipAuthRefresh) {
		try {
			const newToken = await refreshAccessToken();

			const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
				...options,
				headers: {
					...headers,
					Authorization: `Bearer ${newToken}`,
				},
				credentials: 'include',
			});

			if (!retryResponse.ok) {
				const error = await retryResponse.json();
				throw new Error(error.message || 'API error');
			}

			return retryResponse.json();
		} catch {
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
