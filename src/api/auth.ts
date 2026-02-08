import { apiRequest } from './client';

export interface User {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
}

export interface AuthResponse {
	token: string;
	user: User;
}

export function login(email: string, password: string): Promise<AuthResponse> {
	return apiRequest<AuthResponse>('/api/auth/login', {
		method: 'POST',
		body: JSON.stringify({ email, password }),
	}, { skipAuthRefresh: true });
}

export function register(
	firstName: string,
	lastName: string,
	email: string,
	phone: string,
	password: string
) {
	return apiRequest('/api/auth/register', {
		method: 'POST',
		body: JSON.stringify({ firstName, lastName, email, phone, password }),
	});
}

export function forgotPassword(
	email: string
) {
	return apiRequest('/api/auth/forgot-password', {
		method: 'POST',
		body: JSON.stringify({ email }),
	});
}

export function resetPassword(
	otp: string,
	newPassword: string
) {
	return apiRequest('/api/auth/reset-password', {
		method: 'POST',
		body: JSON.stringify({ otp, newPassword }),
	});
}