import { apiRequest } from './client';

export interface SubscriptionData {
	category: string;
	name: string;
	provider: string;
	amount: string;
	billingCycleDays: string;
	startDate: Date;
}

export interface Subscription {
	_id: string;
	name: string;
	amount: number;
	currency: string;
	provider: string;
	status: 'ACTIVE' | 'DUE' | 'EXPIRED';
	nextBillingDate: string;
	cycleInDays: number;
	category: string;
}

export function addSubscription(subscriptionData: SubscriptionData) {
	return apiRequest('/api/subscription', {
		method: 'POST',
		body: JSON.stringify({
			category: subscriptionData.category,
			name: subscriptionData.name,
			provider: subscriptionData.provider,
			amount: Number(subscriptionData.amount),
			billingCycleDays: Number(subscriptionData.billingCycleDays),
			startDate: subscriptionData.startDate,
		}),
	});
}

export function getSubscriptions() {
	return apiRequest<Subscription[]>('/api/subscription', {
		method: 'GET',
	});
}

export function confirmSubscriptionPayment(id: string) {
	return apiRequest(`/api/subscription/${id}/confirm-payment`, {
		method: 'POST',
	});
}

export async function updateSubscription(id: string, subscriptionData: SubscriptionData) {
	return apiRequest(`/api/subscription/${id}`, {
		method: 'PUT',
		body: JSON.stringify({
			category: subscriptionData.category,
			name: subscriptionData.name,
			provider: subscriptionData.provider,
			amount: Number(subscriptionData.amount),
			billingCycleDays: Number(subscriptionData.billingCycleDays),
			startDate: subscriptionData.startDate,
		}),
	});
}

export async function deleteSubscription(id: string) {
	return apiRequest(`/api/subscription/${id}`, {
		method: 'DELETE',
	});
}
