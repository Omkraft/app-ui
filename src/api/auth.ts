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

export function register(firstName: string, lastName: string, email: string, phone: string, password: string) {
	return apiRequest('/api/auth/register', {
		method: 'POST',
		body: JSON.stringify({ firstName, lastName, email, phone, password }),
	});
}

export function logout() {
	localStorage.removeItem('token');
}
