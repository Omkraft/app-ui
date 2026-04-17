import { apiRequest } from './client';

export interface Notification {
	_id: string;

	title: string;

	message: string;

	type:
		| 'SUBSCRIPTION_DUE'
		| 'SUBSCRIPTION_OVERDUE'
		| 'SUBSCRIPTION_PAID'
		| 'INVESTMENT_MATURITY_REMINDER'
		| 'INVESTMENT_MATURITY_DUE'
		| 'INVESTMENT_RD_INSTALLMENT_DUE'
		| string;

	read: boolean;

	createdAt: string;

	metadata?: {
		subscriptionId?: string;
		subscriptionName?: string;
		investmentId?: string;
		institutionName?: string;
		investmentType?: 'FD' | 'RD' | string;
	};
}

/**
 * Fetch notifications
 */
export function fetchNotifications() {
	return apiRequest<Notification[]>('/api/notifications');
}

/**
 * Mark notification as read
 */
export function markNotificationRead(id: string) {
	return apiRequest(`/api/notifications/${id}/read`, {
		method: 'PUT',
	});
}
