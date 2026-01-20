import { apiRequest } from './client';

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
