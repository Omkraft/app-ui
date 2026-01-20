import { apiRequest } from './client';

interface AuthResponse {
	token: string;
}

export function login(email: string, password: string): Promise<AuthResponse> {
	return apiRequest<AuthResponse>('/api/auth/login', {
		method: 'POST',
		body: JSON.stringify({ email, password }),
	});
}

export function register(email: string, password: string) {
	return apiRequest('/api/auth/register', {
		method: 'POST',
		body: JSON.stringify({ email, password }),
	});
}

export function logout() {
	localStorage.removeItem('token');
}
