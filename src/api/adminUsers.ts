import { apiRequest } from './client';

export type UserRole = 'ADMIN' | 'USER';

export interface AdminUser {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	role: UserRole;
	lastActiveAt: string | null;
	online: boolean;
	emailVerified: boolean;
}

interface ListUsersResponse {
	data: AdminUser[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export interface ListUsersParams {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: 'firstName' | 'lastName' | 'email' | 'createdAt' | 'role' | 'lastActiveAt';
	sortOrder?: 'asc' | 'desc';
}

export function listUsers(params: ListUsersParams = {}) {
	const searchParams = new URLSearchParams();
	if (params.page) searchParams.set('page', String(params.page));
	if (params.limit) searchParams.set('limit', String(params.limit));
	if (params.search) searchParams.set('search', params.search);
	if (params.sortBy) searchParams.set('sortBy', params.sortBy);
	if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

	return apiRequest<ListUsersResponse>(`/api/admin/users?${searchParams.toString()}`);
}

export interface UpdateAdminUserPayload {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	role: UserRole;
	password?: string;
}

export function updateAdminUser(id: string, payload: UpdateAdminUserPayload) {
	return apiRequest<{ message: string; user: AdminUser }>(`/api/admin/users/${id}`, {
		method: 'PUT',
		body: JSON.stringify(payload),
	});
}

export function deleteAdminUser(id: string) {
	return apiRequest<{ message: string }>(`/api/admin/users/${id}`, {
		method: 'DELETE',
	});
}
