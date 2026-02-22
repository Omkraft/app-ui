import { apiRequest } from './client';

export interface Notification {
	_id: string;

	title: string;

	message: string;

	type: 'SUBSCRIPTION_DUE' | 'SUBSCRIPTION_OVERDUE' | 'SUBSCRIPTION_PAID' | string;

	read: boolean;

	createdAt: string;

	metadata?: {
		subscriptionId?: string;
		subscriptionName?: string;
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
		method: 'PATCH',
	});
}
