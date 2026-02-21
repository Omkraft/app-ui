import { apiRequest } from './client';

export interface Notification
{
	_id: string;
	title: string;
	message: string;
	read: boolean;
	createdAt: string;
}

export function fetchNotifications()
{
	return apiRequest<Notification[]>(
		'/api/notifications'
	);
}

export function markNotificationRead(id: string)
{
	return apiRequest(
		`/api/notifications/${id}/read`,
		{ method: 'PUT' }
	);
}