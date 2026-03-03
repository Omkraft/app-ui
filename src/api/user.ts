import { apiRequest } from './client';

export interface UserProfile {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
}

interface MeResponse {
	message: string;
	user: {
		userId: string;
		iat: number;
		exp: number;
	};
}

export function getMe(): Promise<MeResponse> {
	return apiRequest<MeResponse>('/api/protected/me');
}

interface ProfileResponse {
	user: UserProfile;
}

interface UpdateProfilePayload {
	firstName: string;
	lastName: string;
	phone: string;
	password?: string;
}

export function getProfile() {
	return apiRequest<ProfileResponse>('/api/auth/profile');
}

export function updateProfile(payload: UpdateProfilePayload) {
	return apiRequest<ProfileResponse>('/api/auth/profile', {
		method: 'PUT',
		body: JSON.stringify(payload),
	});
}
