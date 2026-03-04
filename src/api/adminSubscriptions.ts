import { apiRequest } from './client';

export interface AdminSubscriptionUser {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
}

export interface AdminSubscription {
	_id: string;
	name: string;
	category: string;
	provider: string;
	amount: number;
	cycleInDays: number;
	lastChargedDate: string;
	nextBillingDate: string;
	status: 'ACTIVE' | 'DUE' | 'OVERDUE' | 'INACTIVE' | 'PAUSED';
	inactiveReason?: string | null;
	user: AdminSubscriptionUser | null;
}

interface ListSubscriptionsResponse {
	data: AdminSubscription[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export interface ListSubscriptionsParams {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: 'name' | 'user' | 'provider' | 'amount' | 'status' | 'nextBillingDate' | 'createdAt';
	sortOrder?: 'asc' | 'desc';
}

export function listAdminSubscriptions(params: ListSubscriptionsParams = {}) {
	const searchParams = new URLSearchParams();
	if (params.page) searchParams.set('page', String(params.page));
	if (params.limit) searchParams.set('limit', String(params.limit));
	if (params.search) searchParams.set('search', params.search);
	if (params.sortBy) searchParams.set('sortBy', params.sortBy);
	if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

	return apiRequest<ListSubscriptionsResponse>(
		`/api/admin/subscriptions?${searchParams.toString()}`
	);
}

export interface UpdateAdminSubscriptionPayload {
	name: string;
	category: string;
	provider: string;
	amount: number;
	billingCycleDays: number;
	startDate: string;
}

export type AdminSubscriptionRemovalMode = 'mistake' | 'inactive';

export interface DeleteAdminSubscriptionPayload {
	mode: AdminSubscriptionRemovalMode;
	reason?: string;
}

export function updateAdminSubscription(id: string, payload: UpdateAdminSubscriptionPayload) {
	return apiRequest<{ message: string; subscription: AdminSubscription }>(
		`/api/admin/subscriptions/${id}`,
		{
			method: 'PUT',
			body: JSON.stringify(payload),
		}
	);
}

export function deleteAdminSubscription(id: string, payload: DeleteAdminSubscriptionPayload) {
	return apiRequest<{ message: string }>(`/api/admin/subscriptions/${id}`, {
		method: 'DELETE',
		body: JSON.stringify(payload),
	});
}
